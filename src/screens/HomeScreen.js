import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  LinearGradient,
  Platform,
} from 'react-native';
import {useMemo} from 'react';
import {useGame} from '../context/GameContext';

const {width, height} = Dimensions.get('window');

const getLevelColor = level => {
  const colors = [
    '#4CAF50', // Yeşil
    '#2196F3', // Mavi
    '#9C27B0', // Mor
    '#FF9800', // Turuncu
    '#FF5722', // Kırmızıturuncu
    '#E91E63', // Pembe
    '#673AB7', // Koyu Mor
    '#3F51B5', // İndigo
    '#009688', // Turkuaz
    '#FFC107', // Amber
    '#795548', // Kahverengi
    '#607D8B', // Mavi Gri
    '#8BC34A', // Açık Yeşil
    '#CDDC39', // Lime
    '#00BCD4', // Cyan
    '#9E9E9E', // Gri
    '#FF4081', // Pembe
    '#7C4DFF', // Derin Mor
    '#536DFE', // Mavi
    '#FF5252', // Kırmızı
  ];
  return colors[level % colors.length];
};

export default function HomeScreen({navigation}) {
  const {
    calculateProgress,
    is5LetterUnlocked,
    currentLevel,
    gameCompleted,
    currentTitle,
    isDarkMode,
  } = useGame();
  const progress = useMemo(() => calculateProgress(), [calculateProgress]);
  const levelColor = getLevelColor(currentLevel);
  const is4LetterCompleted = progress.completed4 >= progress.total4;

  // Dark tema için stil değişkenleri
  const themeStyles = {
    backgroundColor: isDarkMode ? '#1a1a1b' : '#fff',
    textColor: isDarkMode ? '#fff' : '#1a1a1b',
    cardBackground: isDarkMode ? '#2c2c2c' : 'rgba(248, 249, 250, 0.95)',
    borderColor: isDarkMode ? '#4CAF50' : '#4CAF50',
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: themeStyles.backgroundColor},
      ]}>
      <View style={[styles.gradientStrip, styles.gradient1]} />
      <View style={[styles.gradientStrip, styles.gradient2]} />
      <View style={[styles.gradientStrip, styles.gradient3]} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {color: themeStyles.textColor}]}>
              <Text style={[styles.gradientText, {color: '#FFD700'}]}>T</Text>
              <Text style={[styles.gradientText, {color: '#FFA500'}]}>E</Text>
              <Text style={[styles.gradientText, {color: '#FF6B6B'}]}>
                K
              </Text>{' '}
              <Text style={[styles.gradientText, {color: '#4FC3F7'}]}>K</Text>
              <Text style={[styles.gradientText, {color: '#81C784'}]}>E</Text>
              <Text style={[styles.gradientText, {color: '#BA68C8'}]}>L</Text>
              <Text style={[styles.gradientText, {color: '#FFB74D'}]}>İ</Text>
              <Text style={[styles.gradientText, {color: '#4DB6AC'}]}>M</Text>
              <Text style={[styles.gradientText, {color: '#E57373'}]}>E</Text>
            </Text>
          </View>
          {currentTitle && (
            <Text
              style={[
                styles.titleText,
                {
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
                  color: themeStyles.textColor,
                },
              ]}>
              {currentTitle} 👑
            </Text>
          )}
        </View>

        <View
          style={[
            styles.levelInfo,
            {
              backgroundColor: themeStyles.cardBackground,
              borderColor: levelColor,
            },
          ]}>
          <View style={styles.levelHeader}>
            <View style={styles.levelTitleContainer}>
              <Text style={[styles.levelText, {color: levelColor}]}>
                Seviye {currentLevel}
              </Text>
              <Image
                source={require('../assets/star.png')}
                style={[styles.starIcon, {tintColor: levelColor}]}
              />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {currentLevel < 10 ? 'Başlangıç' : 'İleri Seviye'}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {backgroundColor: levelColor, width: `${progress.percentage}%`},
              ]}>
              <View style={styles.progressGlow} />
            </View>
          </View>
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>
              İlerleme: %{progress.percentage} ({progress.completed}/
              {progress.total})
            </Text>
            <Text style={styles.remainingText}>
              Kalan Kelime: {progress.remainingWords}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: levelColor},
              is4LetterCompleted && styles.buttonCompleted,
              isDarkMode && {opacity: 0.85},
            ]}
            disabled={is4LetterCompleted}
            onPress={() => navigation.navigate('GameScreen4')}>
            <View>
              <View style={styles.buttonTitleContainer}>
                <Text
                  style={[
                    styles.buttonText,
                    is4LetterCompleted && styles.strikethrough,
                  ]}>
                  4 Harfli Oyun
                </Text>
                {is4LetterCompleted && (
                  <View style={styles.strikethroughLine} />
                )}
              </View>
              <Text style={styles.buttonSubtext}>
                {is4LetterCompleted ? 'Bu modu bitirdiniz!' : '5 Deneme Hakkı'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: is5LetterUnlocked ? levelColor : '#ccc'},
              isDarkMode && {opacity: 0.85},
            ]}
            disabled={!is5LetterUnlocked}
            onPress={() => navigation.navigate('GameScreen5')}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>5 Harfli Oyun</Text>
              <Text style={styles.buttonSubtext}>
                {gameCompleted
                  ? 'Tamamlandı!'
                  : is5LetterUnlocked
                  ? '5 Deneme Hakkı'
                  : '10. Seviyede Açılacak'}
              </Text>
              {!is5LetterUnlocked && (
                <Image
                  source={require('../assets/lock.png')}
                  style={styles.lockIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rulesContainer}>
          <View style={styles.rulesTitleContainer}>
            <Text style={styles.rulesTitle}>📖 Nasıl Oynanır?</Text>
            <View style={styles.rulesUnderline} />
          </View>
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.rulesText}>
                Her kelimeyi 5 deneme hakkında bulmalısınız.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.rulesText}>
                Yeşil harfler doğru yerde, sarı harfler yanlış yerde, gri
                harfler kelimede yok.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.rulesText}>
                Soru işareti butonuna tıklayarak kelime ipucu alabilirsiniz! 🔍
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.rulesText}>
                Yenilenen ipucu haklarınızı akıllıca kullanın.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
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
    backgroundColor: 'rgba(76, 175, 80, 0.1)', // Yeşil
  },
  gradient2: {
    top: height / 3,
    left: -width,
    backgroundColor: 'rgba(33, 150, 243, 0.1)', // Mavi
  },
  gradient3: {
    bottom: -50,
    right: -width / 2,
    backgroundColor: 'rgba(156, 39, 176, 0.1)', // Mor
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 2,
    padding: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 15,
    width: '100%',
    marginVertical: 15,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  rulesContainer: {
    backgroundColor: 'rgba(239, 246, 255, 0.95)',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: width - 40,
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 5,
  },
  rulesText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
  },
  levelInfo: {
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: width - 40,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  starIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: 'rgba(229, 231, 235, 0.5)',
    borderRadius: 6,
    marginVertical: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  levelText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '600',
  },
  remainingText: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.9,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  lockIcon: {
    position: 'absolute',
    right: 20,
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  buttonCompleted: {
    backgroundColor: '#9E9E9E',
    opacity: 0.9,
  },
  buttonTitleContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  strikethrough: {
    opacity: 0.7,
  },
  strikethroughLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    width: '100%',
  },
  gradientText: {
    backgroundColor: 'transparent',
  },
  levelTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  levelBadgeText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  progressDetails: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
  },
  rulesTitleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  rulesUnderline: {
    height: 2,
    width: 60,
    backgroundColor: '#3B82F6',
    marginTop: 5,
    borderRadius: 1,
  },
  rulesList: {
    gap: 12,
    width: '100%',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  ruleBullet: {
    color: '#3B82F6',
    fontSize: 18,
    marginRight: 8,
    marginTop: -2,
  },
  contactIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
});
