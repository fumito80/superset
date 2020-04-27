import React from 'react';
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

// Container
function Folders(props: Folder & typeof actions) {
  const { id, ...other } = props;
  return <ConnectedFolder key={id} id={id} { ...other } />;
}

// Component
function Folder(props: Folder & typeof actions) {
  const { id, label, type, children = [], actionSelectLabel, selected } = props;
  const nodes = children.map(({ id, ...other }) => <ConnectedFolder key={id} id={id} { ...other } />);
  return (
    <li key={id} data-type={type}>
      <a className={selected} onClick={() => actionSelectLabel(id)}>{label}</a>
      <ul>{nodes}</ul>
    </li>
  );
}

// Connect to Redux
function mapStateToProps(state: State, { id }: Folder) {
  const selected = (state.selectedItem === id) ? 'selected' : '';
  const [item] = getItemById(id || state.folder.id, state.folder);
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
