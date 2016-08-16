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
import styles from './styles.js';
import { browserHistory } from 'react-router'
import BoundedImage from '../BoundedImage'

let {Link} = require('react-router');
Link = Radium(Link);

@Radium
class Match extends React.Component {

  render() {

    const input = this.props.input;
    const output = this.props.output;

    return (<div>
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-5">
            <div>
              <span key="item.input.meta.date" style={styles.input.date}>
                {input.meta.date}
              </span>
              <br/>
              <span key="item.input.meta.title" style={styles.input.title}>
                {input.meta.title}</span>
              <br/>
              <span key="item.input.meta.origin" style={styles.input.method}>{input.meta.method}</span>
            </div>

            <div>
              <span key="item.output.meta.date" style={styles.output.date}>
                {output.meta.date}
              </span>
              <br/>
              <span key="item.output.meta.title" style={styles.output.title}>
                {output.meta.title}
              </span>&nbsp;
              <span key="item.output.meta.author" style={styles.output.author}>
                by {output.meta.author}
              </span>
              <br/>
              <span key="item.output.meta.origin" style={styles.output.method}>{output.meta.method}</span>
            </div>

            <BoundedImage item={input} features={output.features.in}/>
            <p style={styles.imgDescription}>{input.meta.origin}</p>

          </div>

          <div className="col-md-5">

            <BoundedImage item={output} features={output.features.out}/>
            <p style={styles.imgDescription}>{output.meta.origin}</p>

          </div>

          <div className="col-md-2">

            <Link style={styles.processLink} to={`/details/${this.props.itemId}`}>View recognition process <span className="icon--i_arrow-right"/></Link>

            <h3>AI Description</h3>
            <p>{output.features.out.description}</p>

            <Link to={`/details/${this.props.itemId}`}>Share</Link>
          </div>

        </div>
      </div>
    </div>);
  }
}

export default Match;

