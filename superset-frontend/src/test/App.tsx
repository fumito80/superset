import React from 'react';
import { hot } from 'react-hot-loader/root';
// import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// import '../../stylesheets/reactable-pagination.less';

setupApp();
setupPlugins();

import './App.css';

import Form, { formSlice } from './Form';
import Folder, { folderSlice } from './Folders';
import ModalConfirm, { modalConfirmSlice } from './Modals';
import { AnyAction } from 'redux';

declare global {

  type Reducer<T> = (state: T, action?: AnyAction) => T;

  interface Item {
    label: string,
    type: string,
    childIds?: number[],
    selected?: boolean,
  }

  interface ModalConfirm {
    open: boolean,
    title: string,
    description: string,
    callback: Reducer<State>,
  }

  interface State {
    props: {
      selectedId: number,
    },
    items: {
      [id: number]: Item,
    },
    modalConfirm: ModalConfirm,
    csrf_token: string,
  }

}

const initialState: State = {
  props: {
    selectedId: 0,
  },
  items: {},
  // items: {
  //   0: {
  //     label: 'root',
  //     type: 'folder',
  //     childIds: [1, 2],
  //   },
  //   1: {
  //     label: 'folder1',
  //     type: 'folder',
  //   },
  //   2: {
  //     label: 'folder2',
  //     type: 'folder',
  //     childIds: [3],
  //   },
  //   3: {
  //     label: 'folder4',
  //     type: 'folder',
  //   },
  // },
  modalConfirm: {
    open: false,
    title: '',
    description: '',
    callback: (state) => state,
  },
  csrf_token: '',
};

function composeReducers<T>(initState: T, ...reducers: Reducer<{}>[]) {
  return (state: T, action: AnyAction) => {
    return reducers.reduce((acc: T, reducer: Reducer<{}>) => {
      return reducer(acc, action);
    }, state ?? initState);
  }
}

const items = JSON.parse(document.getElementById('app')?.dataset.items || "");
const csrf_token = (document.getElementById('csrf_token') as HTMLInputElement)?.value;

const reducer = composeReducers(
  { ...initialState, items, csrf_token },
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
