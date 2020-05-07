import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
// import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
//@ts-ignore
import { Panel, Row, DropdownButton, Button, MenuItem } from 'react-bootstrap';

// import '../../stylesheets/reactable-pagination.less';

setupApp();
setupPlugins();

import './App.css';

import Aside from './containers/Aside';
import Main from './containers/Main';
// import Templates from './components/Templates';
// import MainHeader from './components/MainHeader';
// import Sites from './components/Sites';
// import Units from './components/Units';
// import Nodes from './components/Nodes';
// import Output from './components/Output';
import ModalConfirm, { sliceModalConfirm } from './Modals';
import { AnyAction } from 'redux';

declare global {

  // type Reducer<T> = (state: T, action?: AnyAction) => T;

  interface ModalConfirm {
    open: boolean,
    title: string,
    description: string,
    callback: Reducer<State>,
  }

  interface AppState {
    props: {
      label: string,
      updated: string,
      selectedTmplId: number,
      collapseAside: boolean,
      collapseNewTmpl: boolean,
      collapseTmpl: boolean,
    },
    sitesIds: number[],
    uints: {
      [id: number]: Item,
    },
    node: {
      [id: number]: Item,
    },
    outputIds: number[],
    modalConfirm: ModalConfirm,
    csrf_token: string,
  }

}

const initialState: AppState = {
  props: {
    label: '',
    updated: '',
    selectedTmplId: 0,
    collapseAside: false,
    collapseNewTmpl: false,
    collapseTmpl: false,
  },
  sitesIds: [],
  uints: {},
  node: {},
  outputIds: [],
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
  // sliceAside.reducer,
  // sliceMain.reducer,
  sliceModalConfirm.reducer,
);

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

function App() {
  return (
    <Provider store={store}>
      <>
        <Aside />
        <Main />
        <ModalConfirm />
      </>
    </Provider>
  );
}

export default hot(App);
