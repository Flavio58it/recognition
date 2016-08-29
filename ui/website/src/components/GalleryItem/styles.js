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
const styles = {
  hover: {
    color: '#0fc',
  },
  row: {
    borderBottom: '1px dotted #4a4a4a',
    padding: '64px 0',
    cursor: 'pointer'
  },
  fullHeight: {
    row: {
    },
    col: {
      textAlign:"center",
      position: 'relative'
    },
    img: {
      maxHeight: "95vh",
      verticalAlign: "top",
      maxWidth: "100%",
      margin: '0 auto'
    }
  },
  descriptionColumn: {
    color: '#4a4a4a'
  },
  input: {
    date: {
      color: '#fff',
      fontFamily: 'MaisonNeue',
      fontSize: '12px',
    },
    title: {
      color: '#fff',
      fontSize: '18px',
    },
    origin: {
      textTransform: 'uppercase'
    }
  },
  output: {
    date: {
      fontFamily: 'MaisonNeue',
      fontSize: '12px',
      color: '#fff',
    },
    title: {
      color: '#fff',
      fontStyle: 'italic',
      fontSize: '18px',
    },
    author: {
      color: '#fff',
      fontSize: '18px',
    },
    origin: {
      textTransform: 'uppercase'
    }
  }
}

export default styles;
