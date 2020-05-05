import React from 'react';
import { createStore } from 'redux';
import { hot } from 'react-hot-loader/root';
// import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';

// import '../../stylesheets/reactable-pagination.less';

setupApp();
setupPlugins();

import './App.css';

import Form, { formReducers } from './Form';
import Folder, { foldersReducers } from './Folders';
import ModalConfirm, { modalConfirmReducers } from './Modals';

declare global {

  type Reducer = (state: State) => State;
  
  interface Item {
    label: string,
    type: string,
    childIds: number[],
    selected?: boolean,
  }

  interface ModalConfirm {
    open: boolean,
    title: string,
    description: string,
    callback: Reducer,
  }

  interface State {
    props: {
      selectedId: number,
      // maxId: number,
    },
    items: {
      [id: number]: Item,
    },
    modalConfirm: ModalConfirm,
  }

}

const initState: State = {
  props: {
    selectedId: 0,
  },
  items: {
    0: {
      label: 'root',
      type: 'folder',
      childIds: [1, 2],
    },
    1: {
      label: 'folder1',
      type: 'folder',
      childIds: [],
    },
    2: {
      label: 'folder2',
      type: 'folder',
      childIds: [3],
    },
    3: {
      label: 'folder4',
      type: 'folder',
      childIds: [],
    },
  },
  modalConfirm: {
    open: false,
    title: '',
    description: '',
    callback: (state) => state,
  }
};

const reducers = {
  ...formReducers,
  ...foldersReducers,
  ...modalConfirmReducers,
};

// Store
export const store = createStore((state: State, action) => {
  return (reducers[action.type] || ((a: State) => a))(state, action);
}, initState);

function App() {
  return (
    <>
      <Form />
      <Folder key={0} id={0} />
      <ModalConfirm />
    </>
  );
}

export default hot(App);
