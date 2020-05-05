import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//@ts-ignore
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';
import { AnyAction } from 'redux';

// Actions
enum actions {
  ALT_LABEL = 'ALT_LABEL',
  ADD_ITEM = 'ADD_ITEM',
  DEL_ITEM = 'DEL_ITEM',
}

export type Reducers = {
  [key in actions]: (state: State, action: AnyAction) => State;
}

// Actions Creators
const actionCreators = {
  handleAltLabel: (id: number, label: string) => {
    return { type: actions.ALT_LABEL, id, label };
  },
  handleAddItem: (id: number, label: string) => {
    return { type: actions.ADD_ITEM, id, label };
  },
  handleDelItem: (id: number, label: string) => {
    return { type: actions.DEL_ITEM, id, label };
  },
}

// Reducers
export const formReducers: Reducers = {
  [actions.ALT_LABEL]:
    (state: State, action: ReturnType<typeof actionCreators.handleAltLabel>) => {
      const altedLabelItem = { ...state.items[action.id], label: action.label };
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: altedLabelItem,
        }
      };
    },
  [actions.ADD_ITEM]:
    (state: State, action: ReturnType<typeof actionCreators.handleAddItem>) => {
      const selectedId = Math.max(...Object.keys(state.items).map(Number)) + 1;
      const targetItem = state.items[action.id];
      const addedChildIds = { ...targetItem, childIds: [...targetItem.childIds, selectedId] };
      const newItem = { label: action.label, type: '', childIds: [] };
      return {
        ...state,
        props: {
          selectedId,
        },
        items: {
          ...state.items,
          [action.id]: addedChildIds,
          [selectedId]: newItem,
        },
      };
    },
  [actions.DEL_ITEM]:
    (state: State, action: ReturnType<typeof actionCreators.handleDelItem>) => {
      if (action.id === 0) {
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
    },
}

function delItem(action: ReturnType<typeof actionCreators.handleDelItem>) {
  return (state: State): State => {
    const foundKey = Object.keys(state.items).find(key => state.items[Number(key)].childIds.some(id => id === action.id));
    const parentKey = Number(foundKey);
    const targetItem = state.items[parentKey];
    const deletedChildIds = { ...targetItem, childIds: targetItem.childIds.filter(id => id !== action.id) };
    return {
      ...state,
      props: {
        ...state.props,
        selectedId: parentKey,
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
  handleAltLabel: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  handleDelItem: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
  label: PropTypes.string,
}

type FormProps = PropTypes.InferProps<typeof Form.propTypes>;

function FormContainer(props: FormProps) {
  return <ConnectedForm { ...props } />;
}

function Form(props: FormProps) {
  const { selectedId, label, handleAltLabel, handleAddItem, handleDelItem } = props;
  let labelInput: HTMLInputElement;
  return (
    <div>
      <label>Selected:&nbsp;
        <FormControl
          key={selectedId}
          type="text"
          placeholder="Enter name"
          defaultValue={label}
          bsSize="sm"
          inputRef={(ref: HTMLInputElement) => { labelInput = ref }}
        />
      </label>
      <ButtonGroup aria-label="Item operation">
        <Button bsSize="sm" onClick={() => handleAltLabel(selectedId, labelInput.value)}>Alt name</Button>
        <Button bsSize="sm" onClick={() => handleAddItem(selectedId, labelInput.value)}>Add item</Button>
        <Button bsSize="sm" onClick={() => handleDelItem(selectedId, labelInput.value)}>Del item</Button>
      </ButtonGroup>
    </div>
  );
}

function noop() {}
FormContainer.defaultProps = Form.defaultProps = {
  handleAltLabel: noop,
  handleAddItem: noop,
  handleDelItem: noop,
};

// Connect to Redux
function mapStateToProps(state: State, ownProps: FormProps) {
  return { ...state.props, label: state.items[state.props.selectedId].label };
}

const ConnectedForm = connect(
  null,
  actionCreators
)(Form);

export default connect(
  mapStateToProps,
)(FormContainer);
