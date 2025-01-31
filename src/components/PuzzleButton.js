import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

export default function PuzzleButton({onPress}) {
  return (
    <TouchableOpacity style={styles.puzzleButton} onPress={onPress}>
      <Image
        source={require('../assets/question.png')}
        style={styles.questionIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  puzzleButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionIcon: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50',
  },
});
