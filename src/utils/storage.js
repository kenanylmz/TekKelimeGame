import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveGameProgress = async ({
  completedWords4,
  completedWords5,
  currentLevel,
  is5LetterUnlocked,
  has4LetterCertificate,
  has5LetterCertificate,
  certificates,
  currentTitle,
  puzzleHearts,
  nextHeartTime,
}) => {
  try {
    const gameData = {
      completedWords4: Array.from(completedWords4),
      completedWords5: Array.from(completedWords5),
      currentLevel,
      is5LetterUnlocked,
      has4LetterCertificate,
      has5LetterCertificate,
      certificates,
      currentTitle,
      puzzleHearts: Number(puzzleHearts),
      nextHeartTime: nextHeartTime ? Number(nextHeartTime) : null,
    };
    await AsyncStorage.setItem('gameProgress', JSON.stringify(gameData));
  } catch (error) {
    console.error('Progress kaydedilirken hata:', error);
  }
};

export const loadGameProgress = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('gameProgress');
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      return {
        ...data,
        completedWords4: new Set(data.completedWords4),
        completedWords5: new Set(data.completedWords5),
      };
    }
    return null;
  } catch (error) {
    console.error('Progress yüklenirken hata:', error);
    return null;
  }
};
