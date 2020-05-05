import React from 'react';
import PropTypes from 'prop-types';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
//@ts-ignore
import { Modal, Button } from 'react-bootstrap';

// Actions
enum actions {
  APPLY_CONFIRM = 'APPLY_CONFIRM',
  CANCEL_CONFIRM = 'CANCEL_CONFIRM',
}

type Reducers = {
  [key in actions]: (state: State, action?: AnyAction) => State;
}

// Actions Creators
const actionCreators = {
  handleApply: (callback: Reducer) => {
    return { type: actions.APPLY_CONFIRM, callback };
  },
  handleCancel: () => {
    return { type: actions.CANCEL_CONFIRM };
  },
}

export const modalConfirmReducers: Reducers = {
  [actions.APPLY_CONFIRM]: (state: State, action: ReturnType<typeof actionCreators.handleApply>) => {
    return { ...action.callback(state), modalConfirm: { ...state.modalConfirm, open: false } };
  },
  [actions.CANCEL_CONFIRM]: (state: State) => {
    return { ...state, modalConfirm: { ...state.modalConfirm, open: false } };
  },
}

// Component
ModalConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleApply: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
}

type ModalConfirmProps = PropTypes.InferProps<typeof ModalConfirm.propTypes>;

function ModalConfirm(props: ModalConfirmProps) {
  const { open, title, description, callback, handleApply, handleCancel } = props;
  return (
    <Modal show={open} onHide={handleCancel} bsSize="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button bsStyle="danger" onClick={() => handleApply(callback)}>OK</Button>
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
  handleApply: noop,
  handleCancel: noop,
}

// Connect to Redux
function mapStateToProps({ modalConfirm }: State) {
  return { ...modalConfirm };
}

export default connect(
  mapStateToProps,
  actionCreators,
)(ModalConfirm);
