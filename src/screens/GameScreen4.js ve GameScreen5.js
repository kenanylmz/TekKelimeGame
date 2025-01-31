import React, { useEffect } from 'react';
import SoundManager from '../utils/SoundManager';

const GameScreen4 = () => {
  useEffect(() => {
    SoundManager.playGameMusic();
    return () => {
      SoundManager.playBackgroundMusic();
    };
  }, []);

  const checkGuess = (isCorrect) => {
    if (isCorrect) {
      SoundManager.playCorrectSound();
    } else {
      SoundManager.playWrongSound();
    }
  };

  return (
    // Rest of the component code
  );
};

export default GameScreen4; 