import React from 'react';
import { hot } from 'react-hot-loader/root';
// import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reduceReducers from 'reduce-reducers';

// import '../../stylesheets/reactable-pagination.less';

setupApp();
setupPlugins();

import './App.css';

import Form, { formSlice } from './Form';
import Folder, { folderSlice } from './Folders';
import ModalConfirm, { modalConfirmSlice } from './Modals';

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
    },
    items: {
      [id: number]: Item,
    },
    modalConfirm: ModalConfirm,
  }

}

const initialState: State = {
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

const reducer = reduceReducers(
  initialState,
  formSlice.reducer,
  folderSlice.reducer,
  modalConfirmSlice.reducer,
);

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

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
