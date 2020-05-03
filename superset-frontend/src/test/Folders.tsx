import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAction, ActionType, getType } from 'typesafe-actions';

// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import './Folders.css';

// Actions Creators
const actions = {
  actionSelectLabel: createAction(
    'SELECT_LABEL',
    (id: number) => ({ id }),
  )<{ id: number }>(),
};

// Reducers
type Action = ActionType<typeof actions>;

export const foldersReducer = {
  [getType(actions.actionSelectLabel)]:
    (state: State, action: Action) => {
      return { ...state, props: { ...state.props, selectedItem: action.payload.id } };
    },
}

// Component
Folder.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  childIds: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  selected: PropTypes.bool.isRequired,
  actionSelectLabel: PropTypes.func.isRequired,
}

type FolderProps = PropTypes.InferProps<typeof Folder.propTypes>;

function Folder(props: FolderProps) {
  const { id, label, type, childIds = [], actionSelectLabel, selected } = props;
  const nodes = childIds.map(id => <ConnectedFolder key={id} id={id} />);
  return (
    <li key={id} data-type={type}>
      <a className={selected ? 'selected' : ''} onClick={() => actionSelectLabel(id)}>{label}</a>
      <ul>{nodes}</ul>
    </li>
  );
}

function noop() {}

Folder.defaultProps = {
  id: 0,
  childIds: [],
  label: '',
  type: '',
  selected: false,
  actionSelectLabel: noop,
};

// Connect to Redux
const ConnectedFolder = connect(
  mapStateToProps,
  actions,
)(Folder);

function mapStateToProps(state: State, ownProps: FolderProps) {
  return { ...state.items[ownProps.id], selected: state.props.selectedItem === ownProps.id };
}

export default ConnectedFolder;
