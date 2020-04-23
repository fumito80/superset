import React from 'react';
import { Provider, connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

// import './Folder.css';

function Folder(props) {
  const { id, label, type, children = [] } = props;
  const nodes = children.map(node => <ConnectedFolder key={node.id} id={node.id} />);
  return (
    <li key={id} data-type={type}>
      <span>{label}</span>
      <ul>{nodes}</ul>
    </li>
  );
}

function findOwnProps(node, id) {
  if (node.id === id) {
    return node;
  }
  if (!node.children) {
    return false;
  }
  let ret, child, i = 0;
  while (!ret && (child = node.children[i++])) {
    ret = findOwnProps(child, id);
  }
  return ret;
}

function mapStateToProps(state, ownProps) {
  return findOwnProps(state, ownProps.id) || state;
}

const ConnectedFolder = connect(
  mapStateToProps,
  // null,
  // mapDispatchToProps,
)(Folder);

export default ConnectedFolder;
