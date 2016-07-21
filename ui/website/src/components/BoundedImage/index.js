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
import * as actions from '../../actions';
import BoundedImage from './presenter';

const mapStateToProps = (state, ownProps = {}) => {

  const features = ownProps.features;
  let boxes = [];

  if(features) {

    if(features.densecap &&
      features.densecap.boxes.length > 0) {
      console.log(features.densecap.boxes[0]);
      const img_h = ownProps.item.meta.height;
      const img_w = ownProps.item.meta.width;
      console.log("img: " + img_w + 'x' + img_h);
      const ratio_hw = img_h / img_w;
      console.log("ratio_hw: " + ratio_hw);
      const ref_w = (1.0/ratio_hw) * 720;
      const ref_h = 1;
      console.log("ref_w: " + ref_w);
      boxes = boxes.concat(features.densecap.boxes.map(b => {
        let box = [];
        box[0] = img_w * b[0] / ref_w;
        box[1] = img_h * b[1] / ref_h;
        box[2] = img_w * (b[0] + b[2]) / ref_w;
        box[3] = img_w * (b[1] + b[3]) / ref_h;
        return box;
      }));
      console.log(boxes[0]);
    }

    if(features.vision &&
      features.vision.faces.length > 0) {
      boxes = boxes.concat(features.vision.faces.map(face => {
        return [
          face.faceRectangle.left,
          face.faceRectangle.top,
          face.faceRectangle.width,
          face.faceRectangle.height
        ];
      }));
    }

    if(features.emotion &&
      features.emotion.length > 0) {
      boxes = boxes.concat(features.emotion.map(emotion => {
        return [
          emotion.faceRectangle.left,
          emotion.faceRectangle.top,
          emotion.faceRectangle.width,
          emotion.faceRectangle.height
        ];
      }));
    }

  }

  return {boxes: boxes};
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BoundedImage);
