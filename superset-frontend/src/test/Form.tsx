import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//@ts-ignore
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Slice
export const formSlice = createSlice({
  name: 'form',
  initialState: {},
  reducers: {
    handleAltLabel(state: State, action: PayloadAction<{ id: number, label: string }>) {
      const altedLabelItem = { ...state.items[action.payload.id], label: action.payload.label };
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: altedLabelItem,
        }
      };
    },
    handleAddItem(state: State, action: PayloadAction<{ id: number, label: string }>) {
      const selectedId = Math.max(...Object.keys(state.items).map(Number)) + 1;
      const targetItem = state.items[action.payload.id];
      const addedChildIds = { ...targetItem, childIds: [...targetItem.childIds, selectedId] };
      const newItem = { label: action.payload.label, type: '', childIds: [] };
      return {
        ...state,
        props: {
          selectedId,
        },
        items: {
          ...state.items,
          [action.payload.id]: addedChildIds,
          [selectedId]: newItem,
        },
      };
    },
    handleDelItem(state: State, action: PayloadAction<{ id: number, label: string }>) {
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
});

function delItem(action: PayloadAction<{ id: number, label: string }>) {
  return (state: State): State => {
    const foundKey = Object.keys(state.items).find(key => state.items[Number(key)].childIds.some(id => id === action.payload.id));
    const parentKey = Number(foundKey);
    const targetItem = state.items[parentKey];
    const deletedChildIds = { ...targetItem, childIds: targetItem.childIds.filter(id => id !== action.payload.id) };
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
        <Button bsSize="sm" onClick={() => handleAltLabel({ id: selectedId, label: labelInput.value })}>Alt name</Button>
        <Button bsSize="sm" onClick={() => handleAddItem({ id: selectedId, label: labelInput.value })}>Add item</Button>
        <Button bsSize="sm" onClick={() => handleDelItem({ id: selectedId, label: labelInput.value })}>Del item</Button>
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
  formSlice.actions,
)(Form);

export default connect(
  mapStateToProps,
)(FormContainer);
