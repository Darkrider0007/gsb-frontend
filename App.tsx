import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import Routes from './navigator/Routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <Routes />
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
