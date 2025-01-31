import {View, StyleSheet, Dimensions} from 'react-native';
import {useGame} from '../context/GameContext';
import WordRow from './WordRow';

const windowWidth = Dimensions.get('window').width;
const CELL_SIZE = windowWidth * 0.15;

export default function GameBoard({wordLength, maxAttempts}) {
  const {attempts, currentGuess, gameOver} = useGame();

  const remainingAttempts = Math.max(
    0,
    maxAttempts - (attempts?.length || 0) - 1,
  );
  const emptyRows = Array.from({length: remainingAttempts}, () =>
    Array(wordLength).fill(''),
  );

  return (
    <View style={styles.board}>
      {attempts?.map((attempt, index) => (
        <WordRow
          key={`attempt-${index}`}
          word={attempt.word}
          result={attempt.result}
          wordLength={wordLength}
        />
      ))}
      {!gameOver && (
        <WordRow
          word={currentGuess}
          result={[]}
          wordLength={wordLength}
          isActive={true}
        />
      )}
      {emptyRows.map((_, index) => (
        <WordRow
          key={`empty-${index}`}
          word=""
          result={[]}
          wordLength={wordLength}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
