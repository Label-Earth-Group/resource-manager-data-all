import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { errorReducer } from './errorReducer';
import { eodagApi } from 'modules/EODAG/services/eodagApi.ts';
import { imageApi } from 'modules/ImageData/services/imageApi';

export const store = configureStore({
  reducer: {
    error: errorReducer,
    [eodagApi.reducerPath]: eodagApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer
  },
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(eodagApi.middleware)
      .concat(imageApi.middleware)
});

setupListeners(store.dispatch);

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();
