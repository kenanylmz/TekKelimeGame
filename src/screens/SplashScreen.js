import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {useGame} from '../context/GameContext';
import SoundManager from '../utils/SoundManager';

const {width, height} = Dimensions.get('window');

export default function SplashScreen({navigation}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const {isDarkMode} = useGame();

  useEffect(() => {
    SoundManager.init();
    SoundManager.playBackgroundMusic();

    // Başlık animasyonu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Logo animasyonu
    Animated.sequence([
      Animated.delay(500),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo ölçek animasyonu
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Hoş geldiniz yazısı animasyonu
    Animated.sequence([
      Animated.delay(1000),
      Animated.spring(welcomeAnim, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Ana ekrana geçiş
    setTimeout(() => {
      navigation.replace('MainApp');
    }, 3000);
  }, [fadeAnim, slideAnim, scaleAnim, welcomeAnim, navigation]);

  const themeStyles = {
    backgroundColor: isDarkMode ? '#1a1a1b' : '#fff',
    textColor: isDarkMode ? '#fff' : '#1a1a1b',
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: themeStyles.backgroundColor},
      ]}>
      <View
        style={[
          styles.gradientStrip,
          styles.gradient1,
          isDarkMode && {opacity: 0.05},
        ]}
      />
      <View
        style={[
          styles.gradientStrip,
          styles.gradient2,
          isDarkMode && {opacity: 0.05},
        ]}
      />
      <View
        style={[
          styles.gradientStrip,
          styles.gradient3,
          isDarkMode && {opacity: 0.05},
        ]}
      />

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Text style={[styles.title, {color: themeStyles.textColor}]}>
          <Text style={[styles.gradientText, {color: '#FFD700'}]}>T</Text>
          <Text style={[styles.gradientText, {color: '#FFA500'}]}>E</Text>
          <Text style={[styles.gradientText, {color: '#FF6B6B'}]}>K</Text>{' '}
          <Text style={[styles.gradientText, {color: '#4FC3F7'}]}>K</Text>
          <Text style={[styles.gradientText, {color: '#81C784'}]}>E</Text>
          <Text style={[styles.gradientText, {color: '#BA68C8'}]}>L</Text>
          <Text style={[styles.gradientText, {color: '#FFB74D'}]}>İ</Text>
          <Text style={[styles.gradientText, {color: '#4DB6AC'}]}>M</Text>
          <Text style={[styles.gradientText, {color: '#E57373'}]}>E</Text>
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{translateY: slideAnim}, {scale: scaleAnim}],
          },
        ]}>
        <Image
          source={require('../assets/bulmaca.png')}
          style={[
            styles.logo,
            isDarkMode && {
              shadowColor: isDarkMode ? '#fff' : '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.welcomeContainer,
          {
            opacity: welcomeAnim,
            transform: [
              {
                translateY: welcomeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}>
        <Text style={[styles.welcomeText, {color: themeStyles.textColor}]}>
          Hoş Geldiniz
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 2,
    backgroundColor: 'transparent',
    padding: 15,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  gradientText: {
    backgroundColor: 'transparent',
  },
});
