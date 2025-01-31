import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useGame} from '../context/GameContext';

const {width} = Dimensions.get('window');

export default function PuzzleCard({visible, onClose, puzzle, isDarkMode}) {
  const {
    puzzleHearts,
    getNextHeartTimeRemaining,
    usePuzzle,
    showAd,
    isAdLoaded,
  } = useGame();

  const [nextHeartTimer, setNextHeartTimer] = useState('');
  const [canShowPuzzle, setCanShowPuzzle] = useState(false);

  useEffect(() => {
    if (visible) {
      setCanShowPuzzle(usePuzzle());
    }
  }, [visible, usePuzzle]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextHeartSeconds = getNextHeartTimeRemaining();

      if (nextHeartSeconds) {
        const minutes = Math.floor(nextHeartSeconds / 60);
        const seconds = nextHeartSeconds % 60;
        setNextHeartTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setNextHeartTimer('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getNextHeartTimeRemaining]);

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>
              {canShowPuzzle ? '🔍 💭 💡' : '⏳ 💔'}
            </Text>
            <Text style={styles.headerTitle}>
              {canShowPuzzle ? 'Kelime İpucu' : 'İpucu Hakkı Bitti'}
            </Text>
          </View>

          <View style={styles.heartsContainer}>
            {[...Array(5)].map((_, index) => (
              <Text
                key={index}
                style={[
                  styles.heart,
                  index < puzzleHearts ? styles.heartFull : styles.heartEmpty,
                ]}>
                ❤️
              </Text>
            ))}
          </View>

          {canShowPuzzle ? (
            <View
              style={[
                styles.puzzleContainer,
                {
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                  borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                },
              ]}>
              <View style={styles.puzzleIconContainer}>
                <Text style={styles.puzzleIcon}>📖</Text>
              </View>
              <View style={styles.separator} />
              <Text
                style={[
                  styles.puzzleText,
                  {color: isDarkMode ? '#fff' : '#333'},
                ]}>
                {puzzle}
              </Text>
            </View>
          ) : (
            <View style={styles.timerContainer}>
              {nextHeartTimer && (
                <Text style={styles.timerText}>
                  Sonraki ❤️: {nextHeartTimer}
                </Text>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>Anladım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 10,
  },
  headerEmoji: {
    fontSize: 24,
    marginBottom: 10,
    letterSpacing: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  puzzleContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  puzzleIconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  puzzleIcon: {
    fontSize: 32,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  puzzleText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  footer: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  heart: {
    fontSize: 24,
    marginHorizontal: 4,
  },
  heartEmpty: {
    opacity: 0.3,
  },
  timerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  timerText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginVertical: 5,
  },
});
