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
import Folders, { foldersReducer } from './Folders';
import ModalConfirm, { modalConfirmReducer } from './Modals';

declare global {

  interface FormProps {
    label: string,
    selectedItem: number,
  }

  interface Folder {
    id: number,
    label: string,
    type: string,
    children?: Folder[],
    selected?: string,
  }

  interface ModalConfirm {
    open: boolean,
    title: string,
    description: string,
    callback: (state: State) => State,
  }

  interface State {
    selectedItem: number,
    folder: Folder,
    modalConfirm: ModalConfirm,
    maxId: number,
  }
  
}

const initState: State = {
  maxId: 4,
  selectedItem: 1,
  folder: {
    id: 1,
    label: 'root',
    type: 'folder',
    children: [
      {
        id: 2,
        label: 'folder1',
        type: 'folder',
      },
      {
        id: 3,
        label: 'folder2',
        type: 'folder',
        children: [
          {
            id: 4,
            label: 'folder4',
            type: 'folder',
          },
        ],
      },    
    ],
  },
  modalConfirm: {
    open: false,
    title: '',
    description: '',
    callback: (state) => state,
  }
};

// function betterCombineReducers<T>(original: typeof combineReducers) {
//   return (reducers: ReducersMapObject, initialState: T) => {
//     const newReducers = Object.keys(reducers).reduce((acc: { [key: string]: Reducer<any> }, key: string) => {
//       const fn = reducers[key];
//       const defaultState = initialState[key];
//       acc[key] = (state, action: AnyAction) => {
//         if (state == null) {
//           return defaultState;
//         }
//         return fn(state, action);
//       }
//       return acc;
//     }, {});
//     return original(newReducers);
//   }
// }

// Reducers
// const reducers = betterCombineReducers(combineReducers)({
//   form: formReducers,
//   folder: foldersReducer,
//   modalConfirm: modalConfirmReducer,
// }, initState);

// export const store = createStore(reducers);

const reducers = {
  ...formReducers,
  ...foldersReducer,
  ...modalConfirmReducer,
};

// Store
export const store: any = createStore((state, action) => {
  return (reducers[action.type] || ((state: State) => state))(state, action);
}, initState);

function App() {
  return (
    <>
      <Form />
      <Folders />
      <ModalConfirm />
    </>
  );
}

export default hot(App);
