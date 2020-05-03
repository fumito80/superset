import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//@ts-ignore
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';
import { createAction, ActionType, getType } from 'typesafe-actions';
import _ from 'lodash';
// import * as R from 'ramda';

// Actions
type ActionResult = { id: number, label: string };

const actions = {
  actionAltLabel: createAction(
    'ALT_LABEL',
    (id: number, label: string) => ({ id, label }),
  )<ActionResult>(),
  actionAddItem: createAction(
    'ADD_ITEM',
    (id: number, label: string) => ({ id, label }),
  )<ActionResult>(),
  actionDelItem: createAction(
    'DEL_ITEM',
    (id: number, label: string) => ({ id, label }),
  )<ActionResult>(),
}

type Action = ActionType<typeof actions>;

export const formReducers = {
  [getType(actions.actionAltLabel)]:
    (state: State, action: Action) => {
      const altedLabelItem = { ...state.items[action.payload.id], label: action.payload.label };
      return { ...state, items: { ...state.items, [action.payload.id]: altedLabelItem } };
    },
  [getType(actions.actionAddItem)]:
    (state: State, action: Action) => {
      const maxId = state.props.maxId + 1;
      const targetItem = state.items[action.payload.id];
      const addedChildIds = { ...targetItem, childIds: [...targetItem.childIds, maxId] };
      const newItem = { label: action.payload.label, type: '', childIds: [] };
      return {
        ...state,
        props: {
          maxId,
          selectedItem: maxId,
        },
        items: {
          ...state.items,
          [action.payload.id]: addedChildIds,
          [maxId]: newItem,
        },
      };
    },
  [getType(actions.actionDelItem)]:
    (state: State, action: Action) => {
      if (action.payload.id === 0) {
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

function delItem(action: Action) {
  return (state: State) => {
    const foundKey = Object.keys(state.items).find(key => state.items[Number(key)].childIds.some(id => id === action.payload.id));
    const parentKey = Number(foundKey);
    const targetItem = state.items[parentKey];
    const deletedChildIds = { ...targetItem, childIds: targetItem.childIds.filter(id => id !== action.payload.id) };
    return {
      ...state,
      props: {
        ...state.props,
        selectedItem: parentKey,
      },
      items: {
        ...state.items,
        [parentKey]: deletedChildIds,
      },
    };
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
  return { ...state.props, label: state.items[state.props.selectedItem].label };
}

const ConnectedForm = connect(
  null,
  actions
)(Form);

export default connect(
  mapStateToProps,
)(FormContainer);
