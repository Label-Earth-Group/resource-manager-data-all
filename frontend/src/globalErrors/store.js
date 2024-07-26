import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { errorReducer } from './errorReducer';
import { searchApi } from 'modules/EODAG/services/searchApi.ts';
import { eodagApi } from 'modules/EODAG/services/eodagApi.ts';
import { pgStacApi } from 'modules/PGSTAC/services/pgStacApi.ts';
import { titilerApi } from 'modules/PGSTAC/services/titilerApi.ts';
import { githubApi } from 'modules/GeoJournal/services/githubApi.js';

export const store = configureStore({
  reducer: {
    error: errorReducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [eodagApi.reducerPath]: eodagApi.reducer,
    [pgStacApi.reducerPath]: pgStacApi.reducer,
    [titilerApi.reducerPath]: titilerApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer
  },
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(searchApi.middleware)
      .concat(eodagApi.middleware)
      .concat(pgStacApi.middleware)
      .concat(titilerApi.middleware)
      .concat(githubApi.middleware)
});

setupListeners(store.dispatch);

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();
