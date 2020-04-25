import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getItemById } from './Folder';

// Actions
const UPDATE_LABEL = 'UPDATE_LABEL';
const ADD_ITEM = 'ADD_ITEM';
const DEL_ITEM = 'DEL_ITEM';

// Action Creators
function updateLabel(id, label) {
  return {
    type: UPDATE_LABEL,
    id,
    label,
  };
}

function addItem(id, label) {
  return {
    type: ADD_ITEM,
    id,
    label,
  };
}

function delItem(id, label) {
  return {
    type: DEL_ITEM,
    id,
    label,
  };
}

// Reducer
export const updateLabelReducer = {
  [UPDATE_LABEL]:
    function(state, action) {
      const [, path] = getItemById(Number(action.id), state.items);
      if (!path) {
        return state;
      }
      return _.merge({}, state, { items: _.set({}, [...path, 'label'], action.label) });
    },
  [ADD_ITEM]:
    function(state, action) {
      const [item, path] = getItemById(Number(action.id), state.items);
      if (!item) {
        return state;
      }
      const maxId = state.maxId + 1;
      const children = [...(item.children || []), { id: maxId, label: action.label, type: 'folder' }];
      return _.merge(
        {},
        state,
        { maxId },
        { items: _.set({}, [...path, 'children'], children) },
      );
    },
  [DEL_ITEM]:
    function(state, action) {
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

// Component
function Form(props) {
  const { selectedItem, label, onClickUpdate, onClickAdd, onClickDel } = props;
  let labelInput;
  return (
    <div>
        <label>Selected:&nbsp;
          <input
            key={selectedItem}
            type="text"
            placeholder="Enter name"
            defaultValue={label}
            onChange={() => {}}
            ref={(input) => { labelInput = input; }}
          />
        </label>
        <button onClick={() => onClickUpdate(selectedItem, labelInput.value)}>Alt name</button>
        <button onClick={() => onClickAdd(selectedItem, labelInput.value)}>Add item</button>
        <button onClick={() => onClickDel(selectedItem, labelInput.value)}>Del item</button>
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

function mapDispatchToProps(dispatch) {
  return {
    onClickUpdate(id, label) {
      dispatch(updateLabel(id, label));
    },
    onClickAdd(id, label) {
      dispatch(addItem(id, label));
    },
    onClickDel(id, label) {
      dispatch(delItem(id, label));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);
