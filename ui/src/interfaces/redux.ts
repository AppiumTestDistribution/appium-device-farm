export type ReduxActionType<T> = {
  type: string;
  payload?: T;
};
