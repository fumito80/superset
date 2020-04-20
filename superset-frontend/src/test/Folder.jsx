import React from 'react';
// import PropTypes from 'prop-types';
// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

// import './TreeView.css';

function Folder(props) {
  const { node, getChildNodes } = props;
  // const root = {
  //   name: 'root',
  //   type: 'folder'
  // };
  return (
    <li type={node.type}>
      <span>{node.name}</span>
      <ul></ul>
    </li>
  );
}

export default Folder;
