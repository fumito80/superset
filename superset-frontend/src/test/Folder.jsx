import React from 'react';
import { Provider, connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

// import './Folder.css';

function FolderApp(props) {
  const { id, name, type, children = [] } = props;
  const nodes = children.map(node => <Folder key={node.id} id={node.id} />);
  return (
    <li key={id} data-type={type}>
      <span>{name}</span>
      <ul>{nodes}</ul>
    </li>
  );
}

function findOwnProps(node, id) {
  if (node.id === id) {
    return node;
  }
  return (node.children || []).find(child => findOwnProps(child, id));
}

function mapStateToProps(state, ownProps) {
  return findOwnProps(state, ownProps.id) || state;
}

const Folder = connect(
  mapStateToProps,
  // null,
  // mapDispatchToProps,
)(FolderApp);

export default Folder;
