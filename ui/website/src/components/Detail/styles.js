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
  underline: {
    textDecoration: 'underline'
  },
  borderless: {
    border: 'none !important'
  },
  detailColumn: {
    width:'50%',
    fontFamily: 'monospace',
    fontSize:'12px',
    textTransform: 'uppercase',
    background: "-moz-linear-gradient(left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
    background: "-webkit-linear-gradient(left, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)",
    background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)",
    filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=1 )"
  },
  tableOverflow: {
    'overflow-x': 'none',
  },
  hover: {
    color: '#0fc',
  },
  row: {
    borderBottom: '1px dotted #4a4a4a',
    padding: '20px 0',
    cursor: 'pointer'
  },
  descriptionColumn: {
    color: '#4a4a4a'
  },
  input: {
    date: {
      color: '#fff',
    },
    title: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    origin: {
      textTransform: 'uppercase'
    }
  },
  output: {
    date: {
      color: '#fff',
    },
    title: {
      color: '#fff',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    author: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    origin: {
      textTransform: 'uppercase'
    }
  },
  dataRow: {
    position: 'absolute',
    top: '60px',
    width: '100%',
    pointerEvents: 'none'
  },
  json: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: '#FFF',
    fontFamily: 'TateNewPro',
    border: 0,
    fontSize: '14px',
  }
}

export default styles;