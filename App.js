import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {AppState} from 'react-native';
import SoundManager from './src/utils/SoundManager';
import Router from './src/router';
import {GameProvider} from './src/context/GameContext';
import {StatusBar} from 'react-native';
import {useGame} from './src/context/GameContext';

function AppContent() {
  const {isDarkMode} = useGame();

  useEffect(() => {
    // Ses sistemini başlat
    SoundManager.init();

    // AppState değişikliklerini dinle
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Uygulamadan çıkıldığında sesi durdur
        SoundManager.stopBackgroundMusic();
      } else if (nextAppState === 'active') {
        // Uygulama tekrar açıldığında ses durumunu kontrol et
        const isMuted = SoundManager.isMuted();
        if (!isMuted) {
          SoundManager.playBackgroundMusic();
        }
      }
    });

    // Cleanup
    return () => {
      subscription.remove();
      SoundManager.cleanup();
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1b' : '#ffffff'}
      />
      <Router />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
