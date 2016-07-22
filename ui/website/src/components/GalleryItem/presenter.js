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
import Radium from 'radium';
import moment from 'moment';
import styles from './styles.js';
import { browserHistory } from 'react-router'

let {Link} = require('react-router');
Link = Radium(Link);

@Radium
class GalleryItem extends React.Component {

  state = {hover: false};

  render() {

    const item = this.props.item;
    const selectedOutput = item.output.filter(item => item.selected)[0];

    const rx = /reuters\/(.*)\.jpg/g;
    const arr = rx.exec(item.input.img);
    const itemId = arr[1];

    let classname = "row gallery_item";
    if(this.state.hover) {
      classname += " hovered";
    } else {
      classname += " not_hovered";
    }


    return(<div>
      <div className={classname} style={styles.row}
        onMouseEnter={() => {
          this.setState({hover: true});
        }}
        onMouseLeave={() => {
          this.setState({hover: false});
        }}
        onClick={() => {
          browserHistory.push(`/gallery/${itemId}`);
        }}
      >

        <div className="col-md-9">

          <div className="fluid-container">
            <div className="row">
              <div className="col-md-6">
                <img className="img-responsive" src={item.input.img} />
              </div>
              <div className="col-md-6">
                <img className="img-responsive" src={selectedOutput.img} />
              </div>
            </div>
          </div>

        </div>

        <div className="col-md-3" style={styles.descriptionColumn}>

          <p>No {itemId}</p>

          <p>
            {moment(item.timestamp).format('DD/MM/YYYY')}<br/>
            {moment(item.timestamp).format('hh:mm:ss')}
          </p>

            {this.state.hover ? (
            <div>
              <span key="item.input.meta.date" style={[styles.input.date, styles.hover]}>
                {item.input.meta.date}
              </span>
              <br/>
              <span key="item.input.meta.origin" style={[styles.input.title, styles.hover]}>
                {item.input.meta.caption}</span>
              <br/>
            </div>
            ) : (
            <div>
              <span key="item.input.meta.date" style={styles.input.date}>
                {item.input.meta.date}
              </span>
              <br/>
              <span key="item.input.meta.origin" style={styles.input.title}>
                {item.input.meta.caption}</span>
              <br/>
            </div>
            )}
            <span key="item.input.meta.origin" style={styles.input.origin}>reuters/{item.input.meta.author}</span>

            {this.state.hover ? (
            <div>
              <span key="selectedOutput.meta.date" style={[styles.output.date, styles.hover]}>
                {selectedOutput.meta.date}
              </span>
              <br/>
              <span key="selectedOutput.meta.title" style={[styles.output.title, styles.hover]}>
                {selectedOutput.meta.title}
              </span>&nbsp;
              <span key="selectedOutput.meta.author" style={[styles.output.author, styles.hover]}>
                by {selectedOutput.meta.author}
              </span>
              <br/>
            </div>
            ) : (
            <div>
              <span key="selectedOutput.meta.date" style={styles.output.date}>
                {selectedOutput.meta.date}
              </span>
              <br/>
              <span key="selectedOutput.meta.title" style={styles.output.title}>
                {selectedOutput.meta.title}
              </span>&nbsp;
              <span key="selectedOutput.meta.author" style={styles.output.author}>
                by {selectedOutput.meta.author}
              </span>
              <br/>
            </div>
            )}
            <span style={styles.output.origin}>{selectedOutput.meta.origin}</span>

        </div>

      </div>
    </div>);
  }
}

export default GalleryItem;