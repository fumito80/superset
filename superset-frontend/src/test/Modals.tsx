import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAction, ActionType, getType } from 'typesafe-actions';
//@ts-ignore
import { Modal, Button } from 'react-bootstrap';

// Actions Creators
const actions = {
  actionApply: createAction(
    'APPLY_CONFIRM',
    (callback) => ({ callback }),
  )<ModalConfirm>(),
  actionCancel: createAction(
    'CANCEL_CONFIRM',
    () => ({}),
  )<ModalConfirm>(),
};

// Reducers
type Action = ActionType<typeof actions>;

export const modalConfirmReducer = {
  [getType(actions.actionApply)]:
    (state: State, action: Action) => {
      return { ...action.payload.callback(state), modalConfirm: { open: false } };
    },
  [getType(actions.actionCancel)]:
    (state: State) => {
      return { ...state, modalConfirm: { open: false } };
    },
}

// export const modalConfirmReducer = (state: State, action: Action) => {
//   switch (action.type) {
//     case getType(actions.actionApply):
//       return { ...action.payload.callback(state), modalConfirm: { open: false } };
//     case getType(actions.actionCancel):
//       return { ...state, modalConfirm: { open: false } };
//     default:
//       return state;
//   }
// }

// Component
function noop() {}

// Container
ModalConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionApply: PropTypes.func.isRequired,
  actionCancel: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
}

type ModalConfirmProps = PropTypes.InferProps<typeof ModalConfirm.propTypes>;

function ModalConfirm(props: ModalConfirmProps) {
  const { open, title, description, callback, actionApply, actionCancel } = props;
  return (
    <Modal show={open} onHide={actionCancel} bsSize="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={actionCancel}>Cancel</Button>
        <Button bsStyle="danger" onClick={() => actionApply(callback)}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalConfirm.defaultProps = {
  open: false,
  title: '',
  description: '',
  callback: noop,
  actionApply: noop,
  actionCancel: noop,
}

// Connect to Redux
function mapStateToProps({ modalConfirm }: State) {
  return { ...modalConfirm };
}

export default connect(
  mapStateToProps,
  actions,
)(ModalConfirm);
