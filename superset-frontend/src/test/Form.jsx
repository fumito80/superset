import React from 'react';
import { connect } from 'react-redux';
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';
import _ from 'lodash';

import { getItemById } from './Folder';

// Actions
const ALT_LABEL = 'ALT_LABEL';
const ADD_ITEM = 'ADD_ITEM';
const DEL_ITEM = 'DEL_ITEM';

// Action Creators
function onClickAltLabal(id, label) {
  return {
    type: ALT_LABEL,
    id,
    label,
  };
}

function onClickAddItem(id, label) {
  return {
    type: ADD_ITEM,
    id,
    label,
  };
}

function onClickDelItem(id, label) {
  return {
    type: DEL_ITEM,
    id,
    label,
  };
}

function delItem(action) {
  return (state) => {
    const [item, path] = getItemById(Number(action.id), state.items);
    if (!item || path.length === 0) {
      return state;
    }
    const parentPath = path.slice(0, -2);
    const parent = _.get(state.items, parentPath, state.items);
    const children = parent.children.filter(item => item.id !== action.id);
    const newState = _.set(_.merge({}, state), ['items', ...parentPath, 'children'], children);
    return { ...newState, selectedItem: parent.id };
  }
}

// Reducer
export const updateLabelReducer = {
  [ALT_LABEL]:
    function(state, action) {
      const [, path] = getItemById(action.id, state.items);
      if (!path) {
        return state;
      }
      return _.merge({}, state, { items: _.set({}, [...path, 'label'], action.label) });
    },
  [ADD_ITEM]:
    function(state, action) {
      const [item, path] = getItemById(action.id, state.items);
      if (!item) {
        return state;
      }
      const maxId = state.maxId + 1;
      const children = [...(item.children || []), { id: maxId, label: action.label, type: 'folder' }];
      const items = _.set({}, [...path, 'children'], children);
      return _.merge({}, state, { maxId, items, selectedItem: maxId });
    },
  [DEL_ITEM]:
    function(state, action) {
      const [, path] = getItemById(action.id, state.items);
      if (path.length === 0) {
        return state;
      }
      return {
        ...state,
        modalConfirm: {
          open: true,
          title: `Confirm delete "${action.label}"`,
          description: 'Are you sure?',
          callback: delItem(action),
        }
      };
    }
}

// Component
function Forms(props) {
  const { selectedItem, label, onClickAltLabal, onClickAddItem, onClickDelItem } = props;
  let labelInput;
  return (
    <div>
        <label>Selected:&nbsp;
          <FormControl
            key={selectedItem}
            type="text"
            placeholder="Enter name"
            defaultValue={label}
            bsSize="sm"
            inputRef={(ref) => { labelInput = ref }}
          />
        </label>
        <ButtonGroup aria-label="Item operation">
          <Button bsSize="sm" onClick={() => onClickAltLabal(selectedItem, labelInput.value)}>Alt name</Button>
          <Button bsSize="sm" onClick={() => onClickAddItem(selectedItem, labelInput.value)}>Add item</Button>
          <Button bsSize="sm" onClick={() => onClickDelItem(selectedItem, labelInput.value)}>Del item</Button>
        </ButtonGroup>
    </div>
  );
}

// Connect to Redux
function mapStateToProps(state, ownProps) {
  if (state.selectedItem === ownProps.selectedItem) {
    return;
  }
  const [item] = getItemById(state.selectedItem, state.items);
  return { label: item.label, selectedItem: state.selectedItem };
}

export default connect(
  mapStateToProps,
  { onClickAltLabal, onClickAddItem, onClickDelItem },
)(Forms);
