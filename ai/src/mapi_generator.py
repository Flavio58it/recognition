# Microsoft API results index & search features generator

"""
Copyright 2016 Fabric S.P.A, Emmanuel Benazera, Alexandre Girard

Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
"""

import os, sys
import json
import numpy as np
import shelve
from feature_generator import FeatureGenerator
from index_search import Indexer, Searcher

import logging
logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class MAPIGenerator(FeatureGenerator):

    def __init__(self,image_files,json_files,json_emo_files,index_repo,name,description,meta_in='',meta_out=''):
        self.name = name
        self.description = description
        self.meta_in = meta_in
        self.meta_out = meta_out
        self.image_files = image_files
        self.json_files = json_files
        self.json_emo_files = json_emo_files
        self.index_repo = index_repo + '/' + self.name
        try:
            os.mkdir(self.index_repo)
        except:
            pass
        
        self.mapi_dominant_colors = {}
        self.mapi_tags = {}
        self.mapi_categories = {}
        self.mapi_faces = {} # face + gender + age + emotion
        
        self.emotions={'anger':0,'contempt':1,'disgust':2,'fear':3,'happiness':4,'neutral':5,'sadness':6,'surprise':7}

        return

    # fuzzy matching of rectangles since M$ API do not return the same exact face rectangles with Vision and Emotion API...
    def equal_box(self,box1,box2):
        rtol = 0.05
        if np.isclose(box1['height'],box2['height'],rtol=rtol) and np.isclose(box1['left'],box2['left'],rtol=rtol) and np.isclose(box1['top'],box2['top'],rtol=rtol) and np.isclose(box1['width'],box2['width'],rtol=rtol):
            return True
        else:
            return False
        
    def has_box(self,newbox,boxes):
        n = 0
        for b in boxes:
            if self.equal_box(newbox['faceRectangle'],b['faceRectangle']):
                return n
            n = n + 1
        return -1

    def face_vector(self,fv):
        vec = [0.0] * 10
        vec[0] = fv.get('age',-1)
        gender = -1
        g = fv.get('gender',None)
        if g:
            if g == 'Male':
                gender = 1
            else:
                gender = 2
        vec[1] = gender
        v_emos = fv.get('emotions',None)
        if v_emos:
            for e,pos in self.emotions.iteritems():
                if v_emos.get(e,None):
                    vec[2+pos] = v_emos[e]
        return vec

    def preproc(self):
        ## prepare fields to be indexed:
        # - dominantColors
        # - tags (no scores) -> too generic... take top 5 and attach uniform scores
        # - categories + scores -> keep scores > 0.3
        # - faces + age + gender + emotion (from emotion JSON / API) -> encode age + gender + emotion (8 categories) into vector 

        img_bn = ''
        for jf in self.json_files:
            with open(jf,'r') as jfile:
                json_data = json.load(jfile)
                if not img_bn:
                    jf = jf.replace('//','/')
                    img_bn = os.path.dirname(os.path.dirname(jf))
                img_name = img_bn + '/' + os.path.basename(jf).replace('_mapi.json','.jpg')
                if json_data.get('color',None):
                    self.mapi_dominant_colors[img_name] = []
                    for c in json_data['color']['dominantColors']:
                        self.mapi_dominant_colors[img_name].append({'cat':c,'prob':1.0})
                if json_data.get('description',None):
                    self.mapi_tags[img_name] = []
                    for t in json_data['description']['tags'][:5]:
                        self.mapi_tags[img_name].append({'cat':t,'prob':0.2})
                if json_data.get('categories',None):
                    jd_cats = json_data['categories']
                    for c in jd_cats:
                        self.mapi_categories[img_name] = []
                        if c['score'] >= 0.3:
                            self.mapi_categories[img_name].append({'cat':c['name'],'prob':c['score']})
                if json_data.get('faces',None):
                    self.mapi_faces[img_name] = []
                    jd_faces = json_data['faces']
                    for jf in jd_faces:
                        self.mapi_faces[img_name].append(jf)
                

        for jf in self.json_emo_files:
            with open(jf,'r') as jfile:
                json_data = json.load(jfile)
                img_name = img_bn + '/' + os.path.basename(jf).replace('_mapi.json','.jpg')
                if len(json_data) == 0:
                    continue
                if self.mapi_faces.get(img_name,None) == None:
                    print 'face detected with emotion API but not with Vision API...'
                    self.mapi_faces[img_name] = json_data
                    continue
                for r in json_data:
                    n = self.has_box(r,self.mapi_faces[img_name])
                    if n == -1:
                        continue
                    emo_scores = r['scores']
                    has_emo = False
                    for e,c in self.emotions.iteritems():
                        if emo_scores[e] > 0.5:
                            if not has_emo:
                                self.mapi_faces[img_name][n]['emotions'] = {}
                                has_emo = True
                            self.mapi_faces[img_name][n]['emotions'][e] = emo_scores[e]
        return

    def index(self):
        ## index every variable type
        # - dominant colors (XXX: let's not match based on this, DNN does much better)
        #with Indexer(dim=1,repository=self.index_repo,db_name='colors.bin') as indexer:
        #    for c,v in self.mapi_dominant_colors.iteritems():
        #        indexer.index_tags_single(v,c)
                
        # - tags
        #print 'indexing mapi tags...'
        with Indexer(dim=1,repository=self.index_repo,db_name='tags.bin') as indexer:
            for t,v in self.mapi_tags.iteritems():
                indexer.index_tags_single(v,t)

        # - categories
        #print 'indexing mapi categories...'
        with Indexer(dim=1,repository=self.index_repo,db_name='cats.bin') as indexer:
            for t,v in self.mapi_categories.iteritems():
                indexer.index_tags_single(v,t)

        # - vector for age + gender + emotion + save boxes
        #print 'indexing mapi age, gender, emotion and boxes...'
        c = 0
        with Indexer(dim=10,repository=self.index_repo) as indexer:
            ldb = shelve.open(self.index_repo + '/ldata.bin')
            for f,v in self.mapi_faces.iteritems():
                for fv in v:
                    vec = self.face_vector(fv)
                    indexer.index_single(c,vec,f)
                    ldb[str(c)] = (fv,f)
                    c = c + 1
            ldb.close()
            indexer.build_index()
            indexer.save_index()
        return

    def search(self,jdataout={}):
        results_tags = {}
        with Searcher(self.index_repo,search_size=100,db_name='tags.bin') as searcher:
            searcher.load_index()
            for t,v in self.mapi_tags.iteritems():            
                nns =searcher.search_tags_single(v,t)
                results_tags[t] = nns
        results_tags = self.to_json(results_tags,'/img/reuters/','/img/tate/',self.name+'_tags',self.description,jdataout,self.meta_in,self.meta_out)
        
        results_cats = {}
        with Searcher(self.index_repo,search_size=100,db_name='cats.bin') as searcher:
            searcher.load_index()
            for t,v in self.mapi_categories.iteritems():            
                nns =searcher.search_tags_single(v,t)
                results_cats[t] = nns
        results_cats = self.to_json(results_cats,'/img/reuters/','/img/tate/',self.name+'_cats',self.description,results_tags,self.meta_in,self.meta_out)
                 
        results_faces = {}
        with Searcher(self.index_repo,search_size=1000) as searcher:
            searcher.load_index()
            ldb = shelve.open(self.index_repo + '/ldata.bin')
            for f,v in self.mapi_faces.iteritems():
                resi = {} # results for this image
                for fv in v:
                    vec = self.face_vector(fv)
                    nns = searcher.search_single(vec,f)
                    m = 0
                    #print 'nns scores=',nns['nns'][1]
                    for nuri in nns['nns_uris']:
                        if not nuri in resi:
                            resi[nuri] = {'mapi_out':{'faceRectangles':[],'emotions':[],'genders':[],'ages':[]},
                                          'mapi_in':{'faceRectangles':[],'emotions':[],'genders':[],'ages':[]},
                                          'score':0.0}
                        if not fv.get('faceRectangle',{}) in resi[nuri]['mapi_in']['faceRectangles']:
                            resi[nuri]['mapi_in']['faceRectangles'].append(fv.get('faceRectangle',{}))
                            resi[nuri]['mapi_in']['emotions'].append(fv.get('emotions',{}))
                            resi[nuri]['mapi_in']['genders'].append(fv.get('gender',-1))
                            resi[nuri]['mapi_in']['ages'].append(fv.get('age',-1))

                        nn = nns['nns'][0][m]
                        nndata = ldb[str(nn)]
                        nndata0 = nndata[0]
                        
                        if not nndata0.get('faceRectangle',{}) in resi[nuri]['mapi_out']['faceRectangles']:
                            resi[nuri]['mapi_out']['faceRectangles'].append(nndata0.get('faceRectangle',{}))
                            resi[nuri]['mapi_out']['emotions'].append(nndata0.get('emotions',{}))
                            resi[nuri]['mapi_out']['genders'].append(nndata0.get('gender',-1))
                            resi[nuri]['mapi_out']['ages'].append(nndata0.get('age',-1))
                            resi[nuri]['score'] += nns['nns'][1][m]

                        m = m + 1

                # add uri array
                nnns_uris = []
                nnns = [[],[]]
                for r in resi:
                    if r == 'nns_uris' or r == 'nns':
                        continue
                    nnns_uris.append(r)
                    nnns[0].append('') # dummy array
                    nnns[1].append(resi[r]['score'])
                    del resi[r]['score']
                resi['nns_uris'] = nnns_uris
                resi['nns'] = nnns
                results_faces[f] = resi
                
        ldb.close()
        results_faces = self.to_json(results_faces,'/img/reuters/','/img/tate/',self.name,self.description,results_cats,self.meta_in,self.meta_out)
        return results_faces
        