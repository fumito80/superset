import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
//@ts-ignore
import { FormControl, ButtonGroup, Button } from 'react-bootstrap';

const fetchItems = createAsyncThunk<State, string>(
  'form/fetch',
  async (csrf_token, thunk): Promise<State> => {
    const formData = new FormData();
    formData.append('csrf_token', csrf_token);
    const res = await fetch('/myview/fetch/', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
    if (res.ok) {
      return (await res.json()) as State;
    }
    throw new Error('fetch count error');
  }
);

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
      const addedChildIds = { ...targetItem, childIds: [...(targetItem.childIds || []), selectedId] };
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      return {
        ...state,
        items: action.payload,
      };
    });
  },
});

function delItem(action: PayloadAction<{ id: number, label: string }>) {
  return (state: State): State => {
    const foundKey = Object.keys(state.items).find(key => (state.items[Number(key)].childIds || []).some(id => id === action.payload.id));
    const parentKey = Number(foundKey);
    const targetItem = state.items[parentKey];
    const deletedChildIds = { ...targetItem, childIds: (targetItem.childIds || []).filter(id => id !== action.payload.id) };
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
  selectedId: PropTypes.number,
  label: PropTypes.string,
  csrf_token: PropTypes.string,
  handleAltLabel: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  handleDelItem: PropTypes.func.isRequired,
  fetchItems: PropTypes.func.isRequired,
}

type FormProps = PropTypes.InferProps<typeof Form.propTypes>;

function FormContainer(props: FormProps) {
  return <ConnectedForm { ...props } />;
}

function Form(props: FormProps) {
  const { selectedId, label, csrf_token, handleAltLabel, handleAddItem, handleDelItem, fetchItems } = props;
  const disabledItemButton = selectedId === -1;
  let labelInput: HTMLInputElement;
  return (
    <div>
      <label>Selected:&nbsp;
        <FormControl
          key={selectedId}
          type="text"
          placeholder="Select item"
          defaultValue={label}
          bsSize="sm"
          inputRef={(ref: HTMLInputElement) => { labelInput = ref }}
        />
      </label>
      <ButtonGroup aria-label="Item operation">
        <Button bsSize="sm" bsStyle="info" onClick={() => handleAltLabel({ id: selectedId, label: labelInput.value })} disabled={disabledItemButton}>Alt name</Button>
        <Button bsSize="sm" bsStyle="success" onClick={() => handleAddItem({ id: selectedId, label: labelInput.value })} disabled={disabledItemButton}>Add item</Button>
        <Button bsSize="sm" bsStyle="danger" onClick={() => handleDelItem({ id: selectedId, label: labelInput.value })} disabled={selectedId === 0 || disabledItemButton}>Del item</Button>
        <Button bsSize="sm" bsStyle="warning" onClick={() => fetchItems(csrf_token)}>Reset</Button>
      </ButtonGroup>
    </div>
  );
}

function noop() {}
FormContainer.defaultProps = Form.defaultProps = {
  handleAltLabel: noop,
  handleAddItem: noop,
  handleDelItem: noop,
  fetchItems: noop,
};

// Connect to Redux
function mapStateToProps(state: State): Partial<FormProps> {
  const selectedItem = state.items[state.props.selectedId];
  if (selectedItem == null) {
    return {
      ...state.props,
      selectedId: -1,
      csrf_token: state.csrf_token,
    };
  }
  return {
    ...state.props,
    label: selectedItem.label,
    csrf_token: state.csrf_token,
  };
}

const ConnectedForm = connect(
  null,
  { ...formSlice.actions, fetchItems },
)(Form);

export default connect(
  mapStateToProps,
)(FormContainer);
