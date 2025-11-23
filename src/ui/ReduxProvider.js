'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '../lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import GlobalLoader from './GlobalLoader';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          {children}
          <GlobalLoader />
        </>
      </PersistGate>
    </Provider>
  );
}
