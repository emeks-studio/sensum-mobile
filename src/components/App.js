import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { AppState, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { AppRouter } from './AppRouter';
import ReduxStore from '../state/ReduxStore';
import { configCarrierCrow } from '../model/CarrierCrow';
import { useModel } from '../model-components';
import { showToast } from './ui';
import { handleBackButton } from '../util/navigator';

function App() {
  const [state, setState ] = useState({
    appState: AppState.currentState,
  });

  const { Oracle } = useModel();
  const CarrierCrow = configCarrierCrow({ Oracle });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }    
  })
  
  useEffect(()=> {
    Oracle.praiseTheSun().then(message => {
      showToast({ text: message });
    });
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    }
  })

  useEffect(()=> {
    if (state.appState !== 'background') {
      console.debug('[App::useEffect] First time (not from background)');
      CarrierCrow.suscribe();
      return () => {
        CarrierCrow.unsuscribe();
      }
    }
  }, [state.appState]);

  const handleAppStateChange = (nextAppState) => {
    if (state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.debug('[App::handleAppStateChange] FROM foreground')
      Oracle.praiseTheSun().then(message => {
        showToast({ text: message });
      });
    }
    setState({appState: nextAppState});
  }

  return (
    <Provider store={ReduxStore}>
      <Root>
        <AppRouter />
      </Root>  
    </Provider>   
  );
}

export {
  App
}