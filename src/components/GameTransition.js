import React, {useEffect} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
  FadeOut,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const LETTER_COUNT = 15;
const ANIMATION_DURATION = 3000;

const getRandomColor = () => {
  const colors = [
    '#4CAF50', // Yeşil
    '#2196F3', // Mavi
    '#9C27B0', // Mor
    '#FF9800', // Turuncu
    '#E91E63', // Pembe
    '#3F51B5', // İndigo
    '#009688', // Turkuaz
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateRandomTurkishWords = wordLength => {
  const turkishWords = [
    'MASA',
    'KAPI',
    'OKUL',
    'RENK',
    'KUTU',
    'AĞAÇ',
    'KALE',
    'YAZI',
    'PARA',
    'KARA',
    'DERE',
    'YOLU',
    'KEDİ',
    'KÖŞE',
    'TAKI',
    'KAPI',
    'YAKA',
    'KARA',
    'DOĞA',
    'YELE',
    'KALE',
    'DERE',
    'KAPI',
    'MASA',
    'YAZI',
    'KUTU',
    'TAKI',
    'KEDİ',
    'KÖŞE',
    'YAKA',
    'KALEM',
    'KİTAP',
    'KULAK',
    'MASAJ',
    'KAPAK',
    'BAHÇE',
    'ÇANTA',
    'ŞEKER',
    'KÖPEK',
    'KUŞAK',
    'TABAK',
    'ÇİÇEK',
    'GÜNEŞ',
    'YILAN',
    'DÜNYA',
    'DENİZ',
    'BULUT',
    'YAĞIŞ',
  ];

  const usedWords = new Set();
  const screenWidth = width - 100; // Kenarlardan boşluk bırak

  return Array.from({length: LETTER_COUNT}, (_, index) => {
    let word;
    const filteredWords = turkishWords.filter(w => w.length === wordLength);

    do {
      word = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    } while (usedWords.has(word) && usedWords.size < filteredWords.length);

    usedWords.add(word);

    return {
      char: word,
      x: Math.random() * screenWidth + 50, // Rastgele x pozisyonu
      startY: -50, // Hepsi ekranın üstünden başlasın
      color: getRandomColor(),
      delay: index * 150, // Sırayla düşsünler
    };
  });
};

export default function GameTransition({
  wordLength,
  onAnimationComplete,
  isDarkMode,
}) {
  const words = generateRandomTurkishWords(wordLength);
  const animations = words.map(() => useSharedValue(-100));
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    words.forEach((word, index) => {
      animations[index].value = withDelay(
        word.delay,
        withSequence(
          withTiming(height + 100, {
            duration: ANIMATION_DURATION,
          }),
        ),
      );
    });

    // Yumuşak geçiş için timeout
    const fadeOutTimeout = setTimeout(() => {
      fadeAnim.value = withTiming(
        0,
        {
          duration: 800,
        },
        finished => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        },
      );
    }, ANIMATION_DURATION);

    return () => clearTimeout(fadeOutTimeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1a1a1b' : '#ffffff'},
        containerStyle,
      ]}
      exiting={FadeOut.duration(800)}>
      {words.map((word, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{translateY: animations[index].value}],
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.wordContainer,
              animatedStyle,
              {
                left: word.x,
                top: word.startY,
              },
            ]}>
            <Text
              style={[
                styles.word,
                {
                  color: word.color,
                },
              ]}>
              {word.char}
            </Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    position: 'absolute',
    // left değerini kaldırdık çünkü x pozisyonunu animasyonda kullanacağız
  },
  word: {
    fontSize: 45,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
});
