import React from 'react';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import './App.css';

import { ConnectedFolder, selectLabelReducer } from './Folder';
import Form, { updateLabelReducer } from './Form'

const initState = {
  selectedItem: 1,
  maxId: 4,
  items: {
    id: 1,
    label: 'root',
    type: 'folder',
    children: [
      {
        id: 2,
        label: 'folder1',
        type: 'folder',
      },
      {
        id: 3,
        label: 'folder2',
        type: 'folder',
        children: [
          {
            id: 4,
            label: 'folder4',
            type: 'folder',
          },
        ],
      },    
    ],
  },
};

/* Reducers */
const reducers = {
  ...updateLabelReducer,
  ...selectLabelReducer,
}

const store = createStore((state, action) => {
  return (reducers[action.type] || ((a) => a))(state, action);
}, initState);

function App() {
  return (
    <Provider store={store}>
      <>
        <Form />
        <ConnectedFolder />
      </>
    </Provider>
  );
}

export default App;
