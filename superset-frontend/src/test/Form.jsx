import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getItemById } from './Folder';

// Actions
const UPDATE_LABEL = 'UPDATE_LABEL';
const ADD_ITEM = 'ADD_ITEM';

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

// Reducer
export const updateLabelReducer = {
  [UPDATE_LABEL]: (state, action) => {
    const [, path] = getItemById(Number(action.id), state.items);
    if (!path) {
      return state;
    }
    return _.merge({}, state, { items: _.set({}, [...path, 'label'], action.label) });
  },
  [ADD_ITEM]: (state, action) => {
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
  }
}

// Component
function Form(props) {
  const { selectedItem, label, onClickUpdate, onClickAdd } = props;
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);
