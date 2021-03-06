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
import Match from './presenter';

const mapStateToProps = (state, ownProps = {}) => {

  let props = {}

  if(state.matches.length > 0) {

    let matchId = null;
    if(ownProps.params) {
      matchId = ownProps.params.matchId;
    } else if(state.routing.locationBeforeTransitions.pathname) {
      matchId = state.routing.locationBeforeTransitions.pathname.split("/").pop();
    }

    //let filteredMatchesTPX = state.matches.filter(item => item.input.meta.TPX);
    //if(filteredMatchesTPX == 0) {
    //  filteredMatchesTPX = state.matches;
    //}
    let filteredMatchesTPX = state.matches;

    const matchingIndex = filteredMatchesTPX.findIndex(item => item.input.img.indexOf(matchId) != -1);

    props.item = filteredMatchesTPX[matchingIndex];

    //if(!ownProps.params || !ownProps.params.follower)
      //props.followingMatches = filteredMatchesTPX.slice(matchingIndex + 1);

  }

  return props;
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Match);
