/*
Copyright 2016 Fabrica S.P.A., Emmanuel Benazera, Alexandre Girard

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BoundedImage from './presenter';

const mapStateToProps = (state, ownProps) => {

  let features = ownProps.features;
  let boxes = [];
  let boxids = [];

  if(typeof features != 'undefined' ) {

    if(typeof features.densecap != 'undefined' &&
      typeof features.densecap.boxes != 'undefined' &&
      features.densecap.boxes.length > 0) {

      const img_h = ownProps.item.meta.height;
      const img_w = ownProps.item.meta.width;

      let ratio = img_w / img_h;
      let ref_w = 720;
      let ref_h = (1.0/ratio) * 720;

      if(ratio < 1) {
        ratio = img_h / img_w;
        ref_h = 720;
        ref_w = (1.0/ratio) * 720;
      }

      boxes = boxes.concat(features.densecap.boxes.map(b => {
        let box = [];
        box[0] = img_w * b[0] / ref_w;
        box[1] = img_h * b[1] / ref_h;
        box[2] = img_w * b[2] / ref_w;
        box[3] = img_h * b[3] / ref_h;
        return box;
      }));

      boxids = boxids.concat(features.densecap.boxids);
    }

    if(typeof features.mapi != 'undefined' &&
      typeof features.mapi.faceRectangles != 'undefined' &&
      features.mapi.faceRectangles.length > 0) {
      boxes = boxes.concat(features.mapi.faceRectangles.map(emotion => {
        return [
          emotion.left,
          emotion.top,
          emotion.width,
          emotion.height
        ];
      }));
      boxids = boxids.concat(features.mapi.boxids);
    }

  }

  return {boxes: boxes, boxids: boxids};
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BoundedImage);
