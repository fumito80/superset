import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//@ts-ignore
import { Modal, Button } from 'react-bootstrap';

// Slice
export const sliceModalConfirm = createSlice({
  name: 'modalConfirm',
  initialState: {},
  reducers: {
    handleApplyModal(state: State, action: PayloadAction<{ callback: Reducer<State> }>) {
      return { ...action.payload.callback(state), modalConfirm: { ...state.modalConfirm, open: false } };
    },
    handleCancelModal(state: State) {
      return { ...state, modalConfirm: { ...state.modalConfirm, open: false } };
    },
  }
});

// Component
ModalConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleApplyModal: PropTypes.func.isRequired,
  handleCancelModal: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
}

type ModalConfirmProps = PropTypes.InferProps<typeof ModalConfirm.propTypes>;

function ModalConfirm(props: ModalConfirmProps) {
  const { open, title, description, callback, handleApplyModal, handleCancelModal } = props;
  return (
    <Modal show={open} onHide={handleCancelModal} bsSize="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCancelModal}>Cancel</Button>
        <Button bsStyle="danger" onClick={() => handleApplyModal({ callback })}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

function noop() {}

ModalConfirm.defaultProps = {
  open: false,
  title: '',
  description: '',
  callback: noop,
  handleApplyModal: noop,
  handleCancelModal: noop,
}

// Connect to Redux
function mapStateToProps({ modalConfirm }: State) {
  return { ...modalConfirm };
}

export default connect(
  mapStateToProps,
  sliceModalConfirm.actions,
)(ModalConfirm);
