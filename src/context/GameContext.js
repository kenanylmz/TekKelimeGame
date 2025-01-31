import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import dortKelime from '../Kelimeler/4Kelime';
import besKelime from '../Kelimeler/5Kelime';
import {isValidWord} from '../utils/wordValidator';
import {saveGameProgress, loadGameProgress} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundManager from '../utils/SoundManager';

const GameContext = createContext();

const darkThemeColors = {
  background: '#1a1a1b',
  surface: '#2c2c2c',
  border: '#404040',
  text: '#e0e0e0',
  primary: '#538d4e',
  secondary: '#b59f3b',
  error: '#3a3a3c',
};

const lightThemeColors = {
  background: '#ffffff',
  surface: '#f0f0f0',
  border: '#e0e0e0',
  text: '#1a1a1b',
  primary: '#6aaa64',
  secondary: '#c9b458',
  error: '#787c7e',
};

export const GameProvider = ({children}) => {
  const [currentWord4, setCurrentWord4] = useState('');
  const [currentWord5, setCurrentWord5] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [completedWords4, setCompletedWords4] = useState(new Set());
  const [completedWords5, setCompletedWords5] = useState(new Set());
  const [currentLevel, setCurrentLevel] = useState(1);
  const [is5LetterUnlocked, setIs5LetterUnlocked] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [modalButtonText, setModalButtonText] = useState('Tamam');
  const [modalOnPress, setModalOnPress] = useState(hideModal);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [navigationAction, setNavigationAction] = useState(null);
  const [has4LetterCertificate, setHas4LetterCertificate] = useState(false);
  const [has5LetterCertificate, setHas5LetterCertificate] = useState(false);
  const [puzzleHearts, setPuzzleHearts] = useState(5);
  const [nextHeartTime, setNextHeartTime] = useState(null);
  const [usedPuzzles, setUsedPuzzles] = useState(new Set());
  const timerRef = useRef(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const interstitialRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const totalWords4 = dortKelime.split('\n').length;
  const totalWords5 = besKelime.split('\n').length;
  const totalWords = totalWords4 + totalWords5;

  const wordsPerLevel4 = Math.ceil(totalWords4 / 10);
  const wordsPerLevel5 = Math.ceil(totalWords5 / 10);

  useEffect(() => {
    const completed4 = completedWords4.size;
    const completed5 = completedWords5.size;
    const totalCompleted = completed4 + completed5;

    let level = Math.floor(completed4 / wordsPerLevel4);

    if (completed4 >= totalWords4) {
      level = 10 + Math.floor(completed5 / wordsPerLevel5);
      setIs5LetterUnlocked(true);
    }

    setCurrentLevel(level);

    if (completed4 >= totalWords4 && completed5 >= totalWords5) {
      setGameCompleted(true);
      showGameResult(
        true,
        'Tebrikler!\n\nTüm seviyeleri başarıyla tamamladınız!\n\nToplam Çözülen Kelime: ' +
          totalCompleted,
      );
    }
  }, [completedWords4.size, completedWords5.size]);

  useEffect(() => {
    if (pendingNavigation) {
      const {screen, navigation} = pendingNavigation;
      navigation.navigate(screen);
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  useEffect(() => {
    if (navigationAction) {
      const timer = setTimeout(() => {
        const {type, navigation} = navigationAction;
        if (type === 'reset-and-navigate') {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
          setTimeout(() => {
            navigation.navigate('Profile');
          }, 100);
        }
        setNavigationAction(null);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [navigationAction]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();

      if (!nextHeartTime || now >= nextHeartTime) {
        setPuzzleHearts(prev => {
          if (prev < 5) {
            setNextHeartTime(Date.now() + 60000);
            return prev + 1;
          }
          return prev;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [puzzleHearts, nextHeartTime]);

  useEffect(() => {
    if (currentWord4 || currentWord5) {
      setUsedPuzzles(new Set());
    }
  }, [currentWord4, currentWord5]);

  const calculateProgress = () => {
    const completed4 = completedWords4.size;
    const completed5 = completedWords5.size;
    const totalCompleted = completed4 + completed5;

    let percentage;
    if (!is5LetterUnlocked) {
      percentage = Math.floor((completed4 / totalWords4) * 100);
    } else {
      percentage = Math.floor((totalCompleted / totalWords) * 100);
    }

    return {
      completed: totalCompleted,
      completed4,
      completed5,
      total4: totalWords4,
      total: is5LetterUnlocked ? totalWords : totalWords4,
      percentage,
      remainingWords: is5LetterUnlocked
        ? totalWords - totalCompleted
        : totalWords4 - completed4,
      level: currentLevel,
    };
  };

  const showCertificate = useCallback(
    (type, navigation) => {
      if (type === '4letter' && has4LetterCertificate) return;
      if (type === '5letter' && has5LetterCertificate) return;

      let title = '';
      let message = '';
      const stars = '⭐'.repeat(5);
      const currentDate = new Date();

      if (type === '4letter') {
        setHas4LetterCertificate(true);

        title = 'Kelime Kahramanı';
        setCurrentTitle(title);
        message = `${stars}\n\n🎓 KELİME KAHRAMANI SERTİFİKASI 🎓\n\nBu şerefli unvan, dört harfli kelimelerin tüm sırlarını çözen seçkin oyuncumuza takdim edilmiştir.\n\n🏆 BAŞARILAR 🏆\n• Çözülen Kelime: ${completedWords4.size}\n• Kazanılan Rütbe: Kelime Kahramanı\n• Özel Yetenek: Dört Harfli Kelime Ustası\n\n${stars}`;

        if (!certificates.some(cert => cert.type === '4letter')) {
          setCertificates(prev => [
            ...prev,
            {
              id: Date.now(),
              type: '4letter',
              title,
              date: currentDate,
              details: message,
              icon: '🎓',
            },
          ]);
        }

        showGameResult(
          true,
          '🏆 TEBRİKLER!\n\n4 Harfli Kelime Modunu Tamamladınız!\n\nKelime Kahramanı ünvanını kazandınız!\n\nSertifikamı Gör',
          'Sertifikamı Gör',
          () => {
            hideModal();
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
            setTimeout(() => {
              navigation.navigate('Profile');
            }, 100);
          },
        );
      } else if (type === '5letter') {
        setHas5LetterCertificate(true);
        title = 'Kelime Efsanesi';
        setCurrentTitle(title);
        message = `${stars}\n\n👑 KELİME EFSANESİ SERTİFİKASI 👑\n\nBu eşsiz unvan, tüm kelime dünyasının kapılarını açan seçkin ustamıza takdim edilmiştir.\n\n🏆 ÜSTÜN BAŞARILAR 🏆\n• Toplam Çözülen: ${
          completedWords4.size + completedWords5.size
        }\n• 4 Harfli Zaferler: ${completedWords4.size}\n• 5 Harfli Zaferler: ${
          completedWords5.size
        }\n• Kazanılan Rütbe: Kelime Efsanesi\n• Özel Güç: Tüm Kelimelerin Efendisi\n\n${stars}`;

        if (!certificates.some(cert => cert.type === '5letter')) {
          setCertificates(prev => [
            ...prev,
            {
              id: Date.now(),
              type: '5letter',
              title: 'Kelime Efsanesi',
              date: currentDate,
              details: message,
              icon: '👑',
            },
          ]);
        }

        showGameResult(
          true,
          'Tebrikler! Tüm Oyun Modlarını Tamamladınız!\n\nYeni güncellemelerle daha fazla oyun modu yakında...\n\nSon sertifikanızı profil sayfanızdan görüntüleyebilirsiniz.',
          'Sertifikamı Gör',
          () => {
            hideModal();
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
            setTimeout(() => {
              navigation.navigate('Profile');
            }, 100);
          },
        );
      }
    },
    [
      completedWords4,
      completedWords5,
      hideModal,
      has4LetterCertificate,
      has5LetterCertificate,
      certificates,
    ],
  );

  const getNewWord = (length, navigation) => {
    try {
      const wordList = length === 4 ? dortKelime : besKelime;
      const words = wordList.split('\n').filter(word => word.trim().length > 0);
      const completedSet = length === 4 ? completedWords4 : completedWords5;
      const currentWord = length === 4 ? currentWord4 : currentWord5;

      if (completedSet.size === words.length) {
        if (length === 4 && !has4LetterCertificate) {
          showCertificate('4letter', navigation);
          return null;
        } else if (length === 5 && !has5LetterCertificate) {
          showCertificate('5letter', navigation);
          return null;
        }
        return null;
      }

      const availableWords = words.filter(
        word =>
          !completedSet.has(word.toLowerCase()) &&
          word.toLowerCase() !== currentWord?.toLowerCase(),
      );

      if (availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        return availableWords[randomIndex];
      }

      if (completedSet.size === words.length - 1 && currentWord) {
        return currentWord;
      }

      return null;
    } catch (error) {
      console.error('Kelime seçme hatası:', error);
      return null;
    }
  };

  const resetGame = () => {
    setAttempts([]);
    setGameOver(false);
    setStartTime(Date.now());
  };

  const startNewGame = (length, navigation) => {
    const newWord = getNewWord(length, navigation);
    if (newWord) {
      if (length === 4) {
        setCurrentWord4(newWord);
        setCurrentWord5('');
      } else {
        setCurrentWord5(newWord);
        setCurrentWord4('');
      }
      resetGame();
    }
  };

  const checkGuess = useCallback(
    (guess, currentWord) => {
      if (!guess || !currentWord) return [];

      const normalizedGuess = guess.toUpperCase().trim();
      const normalizedWord = currentWord.toUpperCase().trim();

      console.log('Normalized comparison:', {
        guess: normalizedGuess,
        word: normalizedWord,
      });

      const result = new Array(normalizedWord.length).fill('gray');
      const wordArray = normalizedWord.split('');
      const guessArray = normalizedGuess.split('');

      guessArray.forEach((letter, index) => {
        if (letter === wordArray[index]) {
          result[index] = 'green';
          wordArray[index] = null;
        }
      });

      guessArray.forEach((letter, index) => {
        if (result[index] !== 'green' && wordArray.includes(letter)) {
          const remainingIndex = wordArray.indexOf(letter);
          if (remainingIndex !== -1) {
            result[index] = 'yellow';
            wordArray[remainingIndex] = null;
          }
        }
      });

      const isCorrect = result.every(r => r === 'green');
      if (isCorrect) {
        SoundManager.playCorrectSound();
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000);
        setGameOver(true);

        markWordAsCompleted(normalizedGuess, guess.length);

        showGameResult(
          true,
          `🎉 Harika!\n\nKelimeyi ${attempts.length}. denemede ${duration} saniyede buldunuz!\n\nDevam etmek için 'Sonraki Kelime' butonuna tıklayın.`,
          'Sonraki Kelime',
          () => {
            hideModal();
            startNewGame(guess.length, navigation);
          },
        );
      } else {
        SoundManager.playWrongSound();
        const newAttempts = [...attempts, {word: guess, result}];
        setAttempts(newAttempts);

        if (newAttempts.length >= 5) {
          setGameOver(true);
          showGameResult(
            false,
            `Üzgünüm!\n\nDoğru kelime: ${currentWord.toUpperCase()}\n\nYeni bir kelime ile tekrar deneyin.`,
            'Yeni Kelime',
            () => {
              hideModal();
              startNewGame(guess.length, navigation);
            },
          );
        }

        setCurrentGuess('');
      }

      return result;
    },
    [
      completedWords4,
      completedWords5,
      hideModal,
      has4LetterCertificate,
      has5LetterCertificate,
      certificates,
      startTime,
      attempts,
      markWordAsCompleted,
      showGameResult,
      hideModal,
      startNewGame,
    ],
  );

  const showGameResult = useCallback(
    (success, message, buttonText = 'Tamam', onPress = hideModal) => {
      setModalMessage(message);
      setModalSuccess(success);
      setModalButtonText(buttonText);
      setModalOnPress(() => onPress);
      setShowModal(true);
    },
    [hideModal],
  );

  const hideModal = () => {
    setShowModal(false);
  };

  const markWordAsCompleted = (word, length) => {
    const normalizedWord = word.toLowerCase().trim();
    if (length === 4) {
      setCompletedWords4(prev => new Set([...prev, normalizedWord]));
    } else {
      setCompletedWords5(prev => new Set([...prev, normalizedWord]));
    }
  };

  const handleKeyPress = (key, navigation) => {
    if (gameOver) return;

    const wordLength = currentWord4 ? 4 : 5;
    const currentWord = currentWord4 || currentWord5;

    if (key === 'SİL') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (key === 'ENTER') {
      if (currentGuess.length === 0) {
        showGameResult(false, 'Lütfen kelimeyi boş bırakmayın!');
        return;
      }

      if (currentGuess.length === wordLength) {
        if (!isValidWord(currentGuess)) {
          showGameResult(
            false,
            'Lütfen sadece harf içeren geçerli bir kelime giriniz!',
          );
          return;
        }

        const normalizedGuess = currentGuess.toUpperCase().trim();
        const normalizedWord = currentWord.toUpperCase().trim();

        console.log('Checking word:', {
          guess: normalizedGuess,
          current: normalizedWord,
        });

        const result = checkGuess(normalizedGuess, normalizedWord);
        const newAttempts = [...attempts, {word: currentGuess, result}];
        setAttempts(newAttempts);

        const isCorrect = result.every(r => r === 'green');
        if (isCorrect) {
          const endTime = Date.now();
          const duration = Math.floor((endTime - startTime) / 1000);
          setGameOver(true);

          markWordAsCompleted(normalizedGuess, wordLength);

          showGameResult(
            true,
            `🎉 Harika!\n\nKelimeyi ${newAttempts.length}. denemede ${duration} saniyede buldunuz!\n\nDevam etmek için 'Sonraki Kelime' butonuna tıklayın.`,
            'Sonraki Kelime',
            () => {
              hideModal();
              startNewGame(wordLength, navigation);
            },
          );
        } else if (newAttempts.length >= 5) {
          setGameOver(true);
          showGameResult(
            false,
            `Üzgünüm!\n\nDoğru kelime: ${currentWord.toUpperCase()}\n\nYeni bir kelime ile tekrar deneyin.`,
            'Yeni Kelime',
            () => {
              hideModal();
              startNewGame(wordLength, navigation);
            },
          );
        }

        setCurrentGuess('');
      } else {
        showGameResult(false, `Lütfen ${wordLength} harfli bir kelime girin!`);
      }
    } else {
      if (currentGuess.length < wordLength) {
        const turkishToLower = {
          I: 'ı',
          İ: 'İ',
          Ğ: 'ğ',
          Ü: 'ü',
          Ş: 'ş',
          Ö: 'ö',
          Ç: 'ç',
        };

        const lowerKey = turkishToLower[key] || key.toLowerCase();
        setCurrentGuess(prev => {
          const newGuess = validateWordLength(prev + lowerKey, wordLength);
          console.log('New guess after validation:', newGuess);
          return newGuess;
        });
      }
    }
  };

  const usePuzzle = useCallback(() => {
    const currentWord = currentWord4 || currentWord5;
    if (!usedPuzzles.has(currentWord) && puzzleHearts > 0) {
      setPuzzleHearts(prev => prev - 1);
      setUsedPuzzles(prev => new Set([...prev, currentWord]));
      return true;
    } else if (usedPuzzles.has(currentWord)) {
      return true;
    }
    return false;
  }, [currentWord4, currentWord5, puzzleHearts, usedPuzzles]);

  const getNextHeartTimeRemaining = () => {
    if (!nextHeartTime) return null;
    const remaining = Math.max(0, nextHeartTime - Date.now());
    return Math.ceil(remaining / 1000);
  };

  // Progress'i yükle
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await loadGameProgress();
      if (progress) {
        setCompletedWords4(progress.completedWords4);
        setCompletedWords5(progress.completedWords5);
        setCurrentLevel(progress.currentLevel);
        setIs5LetterUnlocked(progress.is5LetterUnlocked);
        setHas4LetterCertificate(progress.has4LetterCertificate);
        setHas5LetterCertificate(progress.has5LetterCertificate);
        setCertificates(progress.certificates);
        setCurrentTitle(progress.currentTitle);

        // Geçen süreyi hesapla
        const now = Date.now();
        const lastTime = progress.nextHeartTime || now;
        const timePassed = Math.floor((now - lastTime) / 60000); // Geçen dakika

        if (timePassed > 0) {
          // Mevcut kalp sayısı ve eklenecek kalp sayısını hesapla
          const currentHearts = progress.puzzleHearts || 0;
          const totalHearts = Math.min(currentHearts + timePassed, 5);

          // Kalpleri güncelle
          setPuzzleHearts(totalHearts);

          // Eğer hala maksimum kalbe ulaşılmadıysa, yeni timer'ı başlat
          if (totalHearts < 5) {
            setNextHeartTime(Date.now() + 60000);
          } else {
            setNextHeartTime(null);
          }
        } else {
          // Süre geçmediyse mevcut değerleri koru
          setPuzzleHearts(progress.puzzleHearts);
          setNextHeartTime(progress.nextHeartTime);
        }
      }
    };
    loadProgress();
  }, []);

  // Progress'i kaydet
  useEffect(() => {
    saveGameProgress({
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
    });
  }, [
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
  ]);

  const validateWordLength = (word, expectedLength) => {
    if (!word) return '';
    const normalized = word.trim().slice(0, expectedLength);
    console.log(
      'Validating word:',
      normalized,
      'Expected length:',
      expectedLength,
    );
    return normalized;
  };

  useEffect(() => {
    console.log('Current word length:', currentGuess.length);
    console.log('Expected length:', currentWord4 ? 4 : 5);
  }, [currentGuess]);

  // Theme değiştirme fonksiyonu
  const toggleTheme = useCallback(async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme));
    // Tema değiştiğinde renkleri güncelle
    const colors = newTheme ? darkThemeColors : lightThemeColors;
    updateThemeColors(colors);
  }, [isDarkMode]);

  // Tema tercihini yükle
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Tema tercihi yüklenirken hata:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Ses tercihini yükle
  useEffect(() => {
    const loadSoundPreference = async () => {
      try {
        const savedMuteState = await AsyncStorage.getItem('isMuted');
        if (savedMuteState !== null) {
          const isMuted = JSON.parse(savedMuteState);
          setIsMuted(isMuted);
          // SoundManager'ı başlangıç durumuna göre ayarla
          if (isMuted) {
            SoundManager.mute();
          } else {
            SoundManager.unmute();
          }
        }
      } catch (error) {
        console.error('Ses tercihi yüklenirken hata:', error);
      }
    };
    loadSoundPreference();
  }, []);

  // Ses açma/kapama fonksiyonunu güncelle
  const toggleSound = useCallback(async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // SoundManager'ı güncelle
    if (newMutedState) {
      SoundManager.mute();
    } else {
      SoundManager.unmute();
    }

    // Tercihi kaydet
    try {
      await AsyncStorage.setItem('isMuted', JSON.stringify(newMutedState));
    } catch (error) {
      console.error('Ses tercihi kaydedilirken hata:', error);
    }
  }, [isMuted]);

  return (
    <GameContext.Provider
      value={{
        currentWord4,
        currentWord5,
        attempts,
        gameOver,
        startTime,
        currentGuess,
        setCurrentGuess,
        startNewGame,
        checkGuess,
        setAttempts,
        setGameOver,
        resetGame,
        showModal,
        modalMessage,
        modalSuccess,
        showGameResult,
        hideModal,
        currentLevel,
        is5LetterUnlocked,
        calculateProgress,
        markWordAsCompleted,
        gameCompleted,
        currentTitle,
        certificates,
        modalButtonText,
        modalOnPress,
        totalWords4,
        totalWords5,
        handleKeyPress,
        has4LetterCertificate,
        has5LetterCertificate,
        puzzleHearts,
        getNextHeartTimeRemaining,
        usePuzzle,
        showAd: null,
        isAdLoaded: false,
        isDarkMode,
        toggleTheme,
        isMuted,
        toggleSound,
      }}>
      {children}
    </GameContext.Provider>
  );
};
export const useGame = () => useContext(GameContext);
