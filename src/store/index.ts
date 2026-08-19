import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducers';
import rootSaga from './sagas';
import { reduxPersistStorage } from '../utils/Storage';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: reduxPersistStorage,
  whitelist: ['auth'],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares: Middleware[] = [sagaMiddleware];

// if (__DEV__) {
//   const { logger } = require('redux-logger');
//   middlewares.push(logger);
// }

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
  devTools: __DEV__,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type { RootState } from './reducers';