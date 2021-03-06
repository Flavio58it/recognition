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
import ResponsiveImage from './presenter';

const mapStateToProps = (state, ownProps = {}) => {

  if(state.matches.length > 0) {

    let itemId = null;
    if(ownProps.params) {
      itemId = ownProps.params.itemId;
    } else if(state.routing.locationBeforeTransitions.pathname) {
      itemId = state.routing.locationBeforeTransitions.pathname.split("/").pop();
    }

    return {
      itemId: itemId,
      item: state.matches.filter(item => item.input.img.indexOf(itemId) != -1)[0]
    };

  }

  return {};

}

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveImage);
