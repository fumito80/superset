import React from 'react';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import './App.css';

// import Folder from './Folder';

// Actions
const ADD = 'ADD';

// Action Creators
function add(name) {
  // Action
  return {
    type: ADD,
    name,
  };
}

/* Reducers */
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return [ ...state, { name: action.name }];
    default:
      return state;
  }
}

const initState = [
  {
    name: 'root',
  },
];

const store = createStore(reducer, initState);

function Form(props) {
  const { onClickToAdd } = props;
  let textInput;
  return (
    <div>
        <input type="text"
          placeholder="Enter name"
          defaultValue="AAA"
          ref={(input) => { textInput = input; }}
        />
        <button onClick={() => props.onClick(textInput.value) }>Add</button>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <FormContainer />
      {/* <Folder /> */}
    </Provider>
  );
}

// Connect to Redux
function mapStateToProps(state) {
  return {
    name: state[state.length - 1].name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick(name) {
      dispatch(add(name));
    },
  };
}

const FormContainer = connect(
  // mapStateToProps,
  null,
  mapDispatchToProps,
)(Form);

export default App;
