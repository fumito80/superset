import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import './Folders.css';

// Actions
enum actions {
  SELECT_LABEL = 'SELECT_LABEL',
}

type Reducers = {
  [key in actions]: (state: State, action: AnyAction) => State;
}

// Actions Creators
const actionCreators = {
  handleSelectLabel: (id: number) => {
    return { type: actions.SELECT_LABEL, id };
  },
}

// Reducers
export const foldersReducers: Reducers = {
  [actions.SELECT_LABEL]: (state: State, action: ReturnType<typeof actionCreators.handleSelectLabel>) => {
    return { ...state, props: { ...state.props, selectedId: action.id } };
  }
}

// Component
Folder.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  childIds: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  selected: PropTypes.bool.isRequired,
  handleSelectLabel: PropTypes.func.isRequired,
}

type FolderProps = PropTypes.InferProps<typeof Folder.propTypes>;

function Folder(props: FolderProps) {
  const { id, label, type, childIds = [], handleSelectLabel, selected } = props;
  const nodes = childIds.map(id => <ConnectedFolder key={id} id={id} />);
  return (
    <li key={id} data-type={type}>
      <a className={selected ? 'selected' : ''} onClick={() => handleSelectLabel(id)}>{label}</a>
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
  handleSelectLabel: noop,
};

// Connect to Redux
const ConnectedFolder = connect(
  mapStateToProps,
  actionCreators,
)(Folder);

function mapStateToProps(state: State, ownProps: FolderProps) {
  return { ...state.items[ownProps.id], selected: state.props.selectedId === ownProps.id };
}

export default ConnectedFolder;
