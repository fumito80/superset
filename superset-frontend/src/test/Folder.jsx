import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import './Folder.css';

export function getItemById(id, node, path = []) {
  if (node.id === id) {
    return [node, path];
  }
  if (!node.children || id == null) {
    return [null, null];
  }
  let item, itemPath, child, i = 0;
  while (!item && (child = node.children[i])) {
    [item, itemPath] = getItemById(id, child, path.concat('children', i++));
  }
  return [item, itemPath];
}

// Actions
const SELECT_LABEL = 'SELECT_LABEL';

// Action Creators
function selectLabel(id) {
  return {
    type: SELECT_LABEL,
    id,
  };
}

// Reducer
export const selectLabelReducer = {
  [SELECT_LABEL]: function reducer(state, action) {
    return { ...state, selectedItem: action.id };
  }
}

// Component
function Folder(props) {
  const { id, label, type, children = [], onClick, selected } = props;
  const nodes = children.map(node => <ConnectedFolder key={node.id} id={node.id} />);
  return (
    <li key={id} id={id} data-type={type}>
      <a className={selected} onClick={() => onClick(id)}>{label}</a>
      <ul>{nodes}</ul>
    </li>
  );
}

// Connect to Redux
function mapStateToProps(state, { id = state.items.id }) {
  const selected = (state.selectedItem === id) ? 'selected' : '';
  const [item] = getItemById(id, state.items);
  return { ...item, selected };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick(id) {
      dispatch(selectLabel(id));
    },
  };
}

export const ConnectedFolder = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Folder);
