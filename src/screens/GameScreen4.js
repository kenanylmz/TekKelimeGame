import {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import {useGame} from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import MessageModal from '../components/MessageModal';
import PuzzleCard from '../components/PuzzleCard';
import bulmacalar from '../Bulmacalar/4HarfBulmaca';
import PuzzleButton from '../components/PuzzleButton';

const {width, height} = Dimensions.get('window');

export default function GameScreen4({navigation}) {
  const {
    startNewGame,
    gameOver,
    showModal,
    modalMessage,
    modalSuccess,
    hideModal,
    modalButtonText,
    modalOnPress,
    completedWords4,
    totalWords4,
    attempts,
    currentWord4,
    usePuzzle,
    isDarkMode,
  } = useGame();

  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);

  const themeStyles = {
    backgroundColor: isDarkMode ? '#1a1a1b' : '#fff',
    textColor: isDarkMode ? '#e0e0e0' : '#1a1a1b',
    cardBackground: isDarkMode ? '#2c2c2c' : 'rgba(248, 249, 250, 0.95)',
    keyboardBackground: isDarkMode ? '#2c2c2c' : '#fff',
    keyBorderColor: isDarkMode ? '#404040' : '#e0e0e0',
    modalBackground: isDarkMode ? '#2c2c2c' : '#fff',
    puzzleButtonBackground: isDarkMode ? '#2c2c2c' : '#fff',
    puzzleIconColor: isDarkMode ? '#e0e0e0' : '#1a1a1b',
  };

  useEffect(() => {
    console.log('showPuzzle state changed:', showPuzzle);
  }, [showPuzzle]);

  const isGameModeCompleted = completedWords4
    ? completedWords4.size >= totalWords4
    : false;

  useEffect(() => {
    if (!isGameModeCompleted) {
      startNewGame(4, navigation);
    }
  }, []);

  useEffect(() => {
    if (gameOver && !isGameModeCompleted) {
      const timer = setTimeout(() => {
        startNewGame(4, navigation);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, isGameModeCompleted]);

  useEffect(() => {
    if (currentWord4) {
      console.log('Current word updated:', currentWord4);
      // Bulmaca veritabanında kelimeyi ara
      const puzzles = bulmacalar.split('\n').filter(line => line.trim() !== '');
      const found = puzzles.some(puzzle => {
        const [word] = puzzle.split(':');
        return word.trim() === currentWord4.trim();
      });
      console.log('Word exists in puzzle database:', found);
    }
  }, [currentWord4]);

  const getCurrentPuzzle = () => {
    if (!currentWord4) {
      console.log('No current word available');
      return null;
    }

    // Kelimeyi normalize et
    const normalizedCurrentWord = currentWord4.toUpperCase().trim();
    console.log('Looking for puzzle for word:', normalizedCurrentWord);

    // Bulmacaları parse et
    const puzzles = bulmacalar
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const [word, ...defParts] = line.split(':');
        return {
          word: word.trim().toUpperCase(),
          definition: defParts.join(':').trim(),
        };
      });

    // Eşleşen bulmacayı bul
    const matchingPuzzle = puzzles.find(p => p.word === normalizedCurrentWord);

    if (matchingPuzzle) {
      console.log('Found matching puzzle:', matchingPuzzle);
      return matchingPuzzle.definition;
    }

    console.log('No matching puzzle found for:', normalizedCurrentWord);
    return 'Tanım bulunamadı.';
  };

  const handlePuzzlePress = () => {
    if (!currentWord4) {
      console.log('Current word is not available');
      return;
    }

    const puzzle = getCurrentPuzzle();

    if (!puzzle || puzzle === 'Tanım bulunamadı.') {
      console.log('No valid puzzle found');
      return;
    }

    setCurrentPuzzle(puzzle);
    setShowPuzzle(true);
  };

  // Stilleri component içinde oluşturalım
  const getStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: themeStyles.backgroundColor,
      },
      header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'transparent',
      },
      content: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 120 : 90,
      },
      boardContainer: {
        flex: 2,
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 40 : 30,
      },
      keyboardContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: Platform.OS === 'ios' ? 25 : 20,
      },
      puzzleButton: {
        padding: 12,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
      },
      questionIcon: {
        width: 32,
        height: 32,
        tintColor: themeStyles.puzzleIconColor,
      },
      gameOverContainer: {
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderWidth: 1,
      },
      gameOverText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      gradientStrip: {
        position: 'absolute',
        width: width * 2,
        height: 100,
        transform: [{rotate: '-35deg'}],
      },
      gradient1: {
        top: -50,
        left: -width / 2,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
      },
      gradient2: {
        top: height / 3,
        left: -width,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
      },
      gradient3: {
        bottom: -50,
        right: -width / 2,
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
      },
    });

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.puzzleButton,
            {
              backgroundColor: themeStyles.puzzleButtonBackground,
              borderColor: isDarkMode ? '#404040' : '#e0e0e0',
            },
          ]}
          onPress={handlePuzzlePress}>
          <Image
            source={require('../assets/question.png')}
            style={[
              styles.questionIcon,
              {tintColor: themeStyles.puzzleIconColor},
            ]}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.gradientStrip,
          styles.gradient1,
          isDarkMode && {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        ]}
      />
      <View
        style={[
          styles.gradientStrip,
          styles.gradient2,
          isDarkMode && {
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
          },
        ]}
      />
      <View
        style={[
          styles.gradientStrip,
          styles.gradient3,
          isDarkMode && {
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
          },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.boardContainer}>
          <GameBoard wordLength={4} maxAttempts={5} />
        </View>
        <View style={styles.keyboardContainer}>
          <Keyboard navigation={navigation} />
          {gameOver && (
            <View
              style={[
                styles.gameOverContainer,
                {
                  backgroundColor: themeStyles.cardBackground,
                },
              ]}>
              <Text
                style={[styles.gameOverText, {color: themeStyles.textColor}]}>
                {isGameModeCompleted
                  ? 'Mod Tamamlandı'
                  : 'Yeni Oyun Başlıyor...'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <MessageModal
        visible={showModal}
        message={modalMessage}
        buttonText={modalButtonText}
        onPress={modalOnPress}
        success={modalSuccess}
        isDarkMode={isDarkMode}
      />
      <PuzzleCard
        visible={showPuzzle}
        onClose={() => setShowPuzzle(false)}
        puzzle={currentPuzzle}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}

// Sabit stilleri dışarı taşıyalım (opsiyonel)
const baseStyles = StyleSheet.create({
  // isDarkMode kullanmayan sabit stiller buraya gelebilir
});
