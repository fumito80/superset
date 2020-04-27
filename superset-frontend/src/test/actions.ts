import { createAction } from "typesafe-actions";

export const actionAltLabel = createAction(
  'ALT_LABEL',
  (id: number, label: string) => ({ id, label }),
)<Folder>();

export const actionAddItem = createAction(
  'ADD_ITEM',
  (id: number, label: string) => ({ id, label }),
)<Folder>();

export const actionDelItem = createAction(
  'DEL_ITEM',
  (id: number, label: string) => ({ id, label }),
)<Folder>();
