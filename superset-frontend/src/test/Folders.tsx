import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAction, ActionType, getType } from 'typesafe-actions';

// import { Panel, Row, Col, Tabs, Tab, FormControl } from 'react-bootstrap';

import './Folders.css';

type ResultPath = (string | number | symbol)[];

export function getItemById(id: number, node: Folder, path: ResultPath = []): [Folder | null, ResultPath] {
  if (node.id === id) {
    return [node, path];
  }
  if (!node.children) {
    return [null, []];
  }
  let [item, itemPath, child]: [Folder | null, ResultPath, Folder | null] = [null, [], null];
  let i = 0;
  while (!item && (child = node.children[i])) {
    [item, itemPath] = getItemById(id, child, [...path, 'children', i++]);
  }
  return [item, itemPath];
}

// Actions Creators
const actions = {
  actionSelectLabel: createAction(
    'SELECT_LABEL',
    (id: number) => ({ id }),
  )<Folder>(),
};

// Reducers
type Action = ActionType<typeof actions>;

export const foldersReducer = {
  [getType(actions.actionSelectLabel)]:
    (state: State, action: Action) => {
      return { ...state, selectedItem: action.payload.id };
    },
}

// export const foldersReducer = (state: State, action: Action) => {
//   switch (action.type) {
//     case getType(actions.actionSelectLabel): {
//       return { ...state, selectedItem: action.payload.id };
//     }
//     default:
//       return state;
//   }
// }

function noop() {}

// Container
Folders.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  children: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  actionSelectLabel: PropTypes.func.isRequired,
}

type FoldersProps = PropTypes.InferProps<typeof Folders.propTypes>;

function Folders(props: FoldersProps) {
  const { id, ...rest } = props;
  return <ConnectedFolder key={id} id={id} { ...rest } />;
}

Folders.defaultProps = {
  id: 0,
  type: '',
  children: [],
  label: '',
  selected: '',
  actionSelectLabel: noop,
}

// Component
Folder.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.number.isRequired,
  children: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  actionSelectLabel: PropTypes.func.isRequired,
}

type FolderProps = PropTypes.InferProps<typeof Folder.propTypes>;

function Folder(props: FolderProps) {
  const { id, label, type, children = [], actionSelectLabel, selected } = props;
  const nodes = children.map(({ id, ...other }) => <ConnectedFolder key={id} id={id} { ...other } />);
  return (
    <li key={id} data-type={type}>
      <a className={selected} onClick={() => actionSelectLabel(id)}>{label}</a>
      <ul>{nodes}</ul>
    </li>
  );
}

Folder.defaultProps = {
  children: [],
  label: '',
  selected: '',
  actionSelectLabel: noop,
};

// Connect to Redux
function mapStateToProps(state: State, { id }: Folder) {
  const selected = (state.selectedItem === id) ? 'selected' : '';
  const [item] = getItemById(id || state.folder.id, state.folder);
  if (item == null) {
    return { ...state.folder, selected };
  }
  return { ...item, selected };
}

const ConnectedFolder = connect(
  mapStateToProps,
  actions,
)(Folder);

function mapStateToPropsFolders(state: State) {
  return { ...state.folder };
}

export default connect(
  mapStateToPropsFolders,
)(Folders);
