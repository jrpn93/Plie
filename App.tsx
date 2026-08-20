import React, {useEffect} from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppRouter from './src/router/root.router';
import RNBootSplash from 'react-native-bootsplash';

function App() {
  useEffect(() => {
    // hide the native splash screen once the JS app has mounted
    RNBootSplash.hide({ fade: true });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={'dark-content'} />
          <AppRouter />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
