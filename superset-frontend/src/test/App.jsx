import React from 'react';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import * as R from 'ramda';

import './App.css';

import Folder from './Folder';

function findId(id, path = []) {
  return (node) => {
    if (node.id === id) {
      return path;
    }
    if (!node.children) {
      return false;
    }
    let ret, child, i = 0;
    while (!ret && (child = node.children[i])) {
      ret = findId(id, path.concat('children', i++))(child);
    }
    return ret;
  }
}

// Actions
const ADD = 'ADD';

// Action Creators
function add(id, label) {
  // Action
  return {
    type: ADD,
    id,
    label,
  };
}

/* Reducers */
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      const path = findId(Number(action.id))(state);
      if (!path) {
        return state;
      }
      const lens = R.pipe(R.append('label'), R.lensPath)(path);
      return R.set(lens, action.label, state);
    default:
      return state;
  }
}

const initState = {
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
};

const store = createStore(reducer, initState);

function Form(props) {
  // const { onClickToAdd } = props;
  let labelInput, idInput;
  return (
    <div>
        <input type="number"
          placeholder="Enter ID"
          ref={(input) => { idInput = input; }}
        />
        <input type="text"
          placeholder="Enter name"
          defaultValue="AAA"
          ref={(input) => { labelInput = input; }}
        />
        <button onClick={() => props.onClick(idInput.value, labelInput.value) }>Add</button>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <>
        <FormContainer />
        <Folder />
      </>
    </Provider>
  );
}

// Connect to Redux
function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    onClick(id, label) {
      dispatch(add(id, label));
    },
  };
}

const FormContainer = connect(
  // mapStateToProps,
  null,
  mapDispatchToProps,
)(Form);

export default App;
