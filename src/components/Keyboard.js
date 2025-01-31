import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useGame} from '../context/GameContext';
import {isValidWord} from '../utils/wordValidator';

const windowWidth = Dimensions.get('window').width;
const KEY_WIDTH = windowWidth * 0.078;

const KEYBOARD_ROWS = [
  ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['SİL', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'ENTER'],
];

export default function Keyboard({navigation}) {
  const {
    currentWord4,
    currentWord5,
    attempts,
    setAttempts,
    gameOver,
    checkGuess,
    setGameOver,
    startTime,
    currentGuess,
    setCurrentGuess,
    showGameResult,
    markWordAsCompleted,
    startNewGame,
    handleKeyPress,
    isDarkMode,
  } = useGame();

  const currentWord = currentWord4 || currentWord5;
  const maxAttempts = 5;

  const onKeyPress = key => {
    handleKeyPress(key, navigation);
  };

  const getKeyColor = key => {
    if (key === 'ENTER' || key === 'SİL') {
      return [
        styles.specialKey,
        {
          backgroundColor: isDarkMode
            ? '#404040'
            : key === 'ENTER'
            ? '#4CAF50'
            : '#f44336',
          borderColor: isDarkMode
            ? '#505050'
            : key === 'ENTER'
            ? '#4CAF50'
            : '#f44336',
        },
      ];
    }

    let color = [
      styles.key,
      {
        backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
        borderColor: isDarkMode ? '#404040' : '#e0e0e0',
      },
    ];

    const keyLower = key.toLowerCase();

    for (const attempt of attempts) {
      const index = attempt.word.indexOf(keyLower);
      if (index !== -1) {
        if (attempt.result[index] === 'green') {
          return [styles.key, styles.correctKey];
        } else if (attempt.result[index] === 'yellow') {
          color = [styles.key, styles.presentKey];
        } else if (attempt.result[index] === 'gray') {
          color = [styles.key, styles.wrongKey];
        }
      }
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.keyboard,
          {
            backgroundColor: isDarkMode
              ? '#1a1a1b'
              : 'rgba(232, 232, 232, 0.95)',
          },
        ]}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  getKeyColor(key),
                  (key === 'ENTER' || key === 'SİL') && styles.specialKey,
                ]}
                onPress={() => onKeyPress(key)}>
                <Text
                  style={[
                    styles.keyText,
                    {color: isDarkMode ? '#e0e0e0' : '#1a1a1b'},
                    (key === 'ENTER' || key === 'SİL') && styles.specialKeyText,
                  ]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 'auto',
    paddingHorizontal: 4,
  },
  keyboard: {
    marginBottom: 15,
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    width: KEY_WIDTH,
    height: KEY_WIDTH * 1.3,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
  },
  specialKey: {
    width: KEY_WIDTH * 1.6,
  },
  keyText: {
    fontSize: 16,
    fontWeight: '700',
  },
  specialKeyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  correctKey: {
    backgroundColor: '#6aaa64',
    borderColor: '#6aaa64',
  },
  presentKey: {
    backgroundColor: '#c9b458',
    borderColor: '#c9b458',
  },
  wrongKey: {
    backgroundColor: '#787c7e',
    borderColor: '#787c7e',
  },
});
