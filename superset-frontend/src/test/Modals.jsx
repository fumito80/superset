import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

// Actions
const APPLY_CONFIRM = 'APPLY_CONFIRM';
const CANCEL_CONFIRM = 'CANCEL_CONFIRM';

// Action Creators
function apply(callback) {
  return {
    type: APPLY_CONFIRM,
    callback,
  };
}

function cancel() {
  return {
    type: CANCEL_CONFIRM,
  };
}

// Reducer
export const modalConfirmReducer = {
  [APPLY_CONFIRM]:
    function(state, action) {
      return { ...action.callback(state, action), modalConfirm: { open: false } };
    },
  [CANCEL_CONFIRM]:
    function(state, action) {
      return { ...state, modalConfirm: { open: false } };
    },
}

// Component
function ModalConfirm(props) {
  const { modalConfirm: { open, title, description, callback }, apply, cancel } = props;
  return (
    <Modal show={open} onHide={cancel} bsSize="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={cancel}>Cancel</Button>
        <Button bsStyle="danger" onClick={() => apply(callback)}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

// Connect to Redux
function mapStateToProps({ modalConfirm }) {
  return { modalConfirm };
}

export default connect(
  mapStateToProps,
  { apply, cancel },
)(ModalConfirm);
