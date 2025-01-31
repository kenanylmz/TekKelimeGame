import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useGame} from '../context/GameContext';

const windowWidth = Dimensions.get('window').width;
const CELL_SIZE = windowWidth * 0.15; // Ekran genişliğine göre hücre boyutu

export default function WordRow({word, result, wordLength, isActive}) {
  const {isDarkMode} = useGame();

  // Kelime uzunluğunu sınırla
  const limitedWord = word.slice(0, wordLength);
  const letters = limitedWord.padEnd(wordLength).split('');

  return (
    <View style={styles.row}>
      {letters.map((letter, index) => (
        <View
          key={index}
          style={[
            styles.cell,
            {
              borderColor: isDarkMode ? '#404040' : '#d3d6da',
              backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              elevation: isDarkMode ? 4 : 3,
            },
            letter && [
              styles.filledCell,
              {borderColor: isDarkMode ? '#505050' : '#878a8c'},
            ],
            result[index] === 'green' && [
              styles.correctCell,
              {
                backgroundColor: isDarkMode ? '#538d4e' : '#6aaa64',
                borderColor: isDarkMode ? '#538d4e' : '#6aaa64',
              },
            ],
            result[index] === 'yellow' && [
              styles.presentCell,
              {
                backgroundColor: isDarkMode ? '#b59f3b' : '#c9b458',
                borderColor: isDarkMode ? '#b59f3b' : '#c9b458',
              },
            ],
            result[index] === 'gray' && [
              styles.wrongCell,
              {
                backgroundColor: isDarkMode ? '#3a3a3c' : '#787c7e',
                borderColor: isDarkMode ? '#3a3a3c' : '#787c7e',
              },
            ],
            isActive && letter && styles.activeCell,
          ]}>
          <Text
            style={[
              styles.letter,
              {color: isDarkMode ? '#000000' : '#1a1a1b'},
              (result[index] === 'green' ||
                result[index] === 'yellow' ||
                result[index] === 'gray') &&
                styles.resultLetter,
            ]}>
            {letter.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
  },
  filledCell: {
    transform: [{scale: 1.02}],
  },
  correctCell: {
    transform: [{scale: 1.05}],
  },
  presentCell: {
    transform: [{scale: 1.05}],
  },
  wrongCell: {
    transform: [{scale: 1}],
  },
  letter: {
    fontSize: CELL_SIZE * 0.6,
    fontWeight: 'bold',
  },
  activeCell: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 3,
    transform: [{scale: 1.1}],
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resultLetter: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});
