import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//@ts-ignore
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';
import { createAction, ActionType, getType } from 'typesafe-actions';
import _ from 'lodash';
// import * as R from 'ramda';

import { getItemById } from './Folders';

// Actions
const actions = {
  actionAltLabel: createAction(
    'ALT_LABEL',
    (id: number, label: string) => ({ id, label }),
  )<Folder>(),
  actionAddItem: createAction(
    'ADD_ITEM',
    (id: number, label: string) => ({ id, label }),
  )<Folder>(),
  actionDelItem: createAction(
    'DEL_ITEM',
    (id: number, label: string) => ({ id, label }),
  )<Folder>(),
}

type Action = ActionType<typeof actions>;

export const formReducers = {
  [getType(actions.actionAltLabel)]:
    (state: State, action: Action) => {
      const [, path] = getItemById(action.payload.id, state.folder);
      if (!path) {
        return state;
      }
      return _.merge({}, state, _.set({}, ['folder', ...path, 'label'], action.payload.label));
    },
  [getType(actions.actionAddItem)]:
    (state: State, action: Action) => {
      const [item, path] = getItemById(action.payload.id, state.folder);
      if (!item) {
        return state;
      }
      const maxId = state.maxId + 1;
      // const newChildren = [...(item.children || []), { id: maxId, label: action.payload.label, type: 'folder' }];
      // const newState = R.set(R.lensPath([...path, 'children']), newChildren, state);
      const newChildren = [...(item.children || []), { id: maxId, label: action.payload.label, type: 'folder' }];
      const newState = _.set(_.merge({}, state), ['folder', ...path, 'children'], newChildren);
      return { ...newState, maxId, selectedItem: maxId };
    },
  [getType(actions.actionDelItem)]:
    (state: State, action: Action) => {
      const [, path] = getItemById(action.payload.id, state.folder);
      if (path.length === 0) {
        return state;
      }
      return {
        ...state,
        modalConfirm: {
          open: true,
          title: `Confirm delete "${action.payload.label}"`,
          description: 'Are you sure?',
          callback: delItem(action),
        }
      };
    },
}

// export const formReducers = (state: State, action: Action) => {
//   switch (action.type) {
//     case getType(actions.actionAltLabel): {
//       const [, path] = getItemById(action.payload.id, state.folder);
//       if (!path) {
//         return state;
//       }
//       return _.merge({}, state, _.set({}, ['folder', ...path, 'label'], action.payload.label));
//     }
//     case getType(actions.actionAddItem): {
//       const [item, path] = getItemById(action.payload.id, state.folder);
//       if (!item) {
//         return state;
//       }
//       const maxId = state.maxId + 1;
//       // const newChildren = [...(item.children || []), { id: maxId, label: action.payload.label, type: 'folder' }];
//       // const newState = R.set(R.lensPath([...path, 'children']), newChildren, state);
//       const newChildren = [...(item.children || []), { id: maxId, label: action.payload.label, type: 'folder' }];
//       const newState = _.set(_.merge({}, state), ['folder', ...path, 'children'], newChildren);
//       return { ...newState, maxId, selectedItem: maxId };
//     }
//     case getType(actions.actionDelItem): {
//       const [, path] = getItemById(action.payload.id, state.folder);
//       if (path.length === 0) {
//         return state;
//       }
//       return {
//         ...state,
//         modalConfirm: {
//           open: true,
//           title: `Confirm delete "${action.payload.label}"`,
//           description: 'Are you sure?',
//           callback: delItem(action),
//         }
//       };
//     }
//     default:
//       return state;
//   }
// }

function delItem(action: Action) {
  return (state: State) => {
    const [item, path] = getItemById(action.payload.id, state.folder);
    if (!item || path.length === 0) {
      return state;
    }
    const parentPath = path.slice(0, -2);
    const parent = _.get(state.folder, parentPath, state.folder) as Folder;
    const children = parent.children?.filter(item => item.id !== action.payload.id);
    const newState = _.set(_.merge({}, state), ['folder', ...parentPath, 'children'], children);
    return { ...newState, selectedItem: parent.id };
  }
}

// Component
Form.propTypes = {
  actionAltLabel: PropTypes.func.isRequired,
  actionAddItem: PropTypes.func.isRequired,
  actionDelItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.number,
  label: PropTypes.string,
}

type FormProps = PropTypes.InferProps<typeof Form.propTypes>;

function FormContainer(props: FormProps) {
  const { selectedItem, label, ...rest } = props;
  return <ConnectedForm selectedItem={selectedItem} label={label} { ...rest } />;
}

function Form(props: FormProps) {
  const { selectedItem, label, actionAltLabel, actionAddItem, actionDelItem } = props;
  let labelInput: HTMLInputElement;
  return (
    <div>
      <label>Selected:&nbsp;
        <FormControl
          key={selectedItem}
          type="text"
          placeholder="Enter name"
          defaultValue={label}
          bsSize="sm"
          inputRef={(ref: HTMLInputElement) => { labelInput = ref }}
        />
      </label>
      <ButtonGroup aria-label="Item operation">
        <Button bsSize="sm" onClick={() => actionAltLabel(selectedItem, labelInput.value)}>Alt name</Button>
        <Button bsSize="sm" onClick={() => actionAddItem(selectedItem, labelInput.value)}>Add item</Button>
        <Button bsSize="sm" onClick={() => actionDelItem(selectedItem, labelInput.value)}>Del item</Button>
      </ButtonGroup>
    </div>
  );
}

function noop() {}
FormContainer.defaultProps = Form.defaultProps = {
  actionAltLabel: noop,
  actionAddItem: noop,
  actionDelItem: noop,
};

// Connect to Redux
function mapStateToProps(state: State, ownProps: FormProps) {
  // if (state.selectedItem === ownProps.selectedItem) {
  //   return { label: ownProps.label, selectedItem: ownProps.selectedItem };
  // }
  const [item] = getItemById(state.selectedItem, state.folder);
  if (item == null) {
    return { label: ownProps.label, selectedItem: ownProps.selectedItem };
    // return state;
  }
  return { label: item.label, selectedItem: state.selectedItem };
}

const ConnectedForm = connect(
  // mapStateToProps,
  null,
  actions
)(Form);

// export default ConnectedForm;

export default connect(
  mapStateToProps,
)(FormContainer);
