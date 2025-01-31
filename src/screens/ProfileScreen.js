import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {useGame} from '../context/GameContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export default function ProfileScreen() {
  const {
    currentTitle,
    calculateProgress,
    certificates,
    isDarkMode,
    toggleTheme,
    toggleSound,
    isMuted,
  } = useGame();
  const progress = calculateProgress();

  // Dark tema için stil değişkenleri
  const themeStyles = {
    backgroundColor: isDarkMode ? '#1a1a1b' : '#fff',
    textColor: isDarkMode ? '#fff' : '#1a1a1b',
    cardBackground: isDarkMode ? '#2c2c2c' : 'rgba(248, 249, 250, 0.95)',
    borderColor: isDarkMode ? '#4CAF50' : '#4CAF50',
  };

  const handleContactPress = async () => {
    const email = 'fkhmobile3@gmail.com';
    const subject = encodeURIComponent('Tek Kelime Uygulaması Geri Bildirim');
    const body = encodeURIComponent('Merhaba,\n\n');

    let url = '';
    if (Platform.OS === 'android') {
      url = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      url = `mailto:${email}?subject=${subject}&body=${body}`;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('E-posta uygulaması açılamadı:', error);
      // Hata durumunda kullanıcıya bilgi verebiliriz
      Alert.alert(
        'Hata',
        'E-posta uygulaması açılamadı. Lütfen bir e-posta uygulaması yüklü olduğundan emin olun.',
        [{text: 'Tamam', style: 'cancel'}],
      );
    }
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, {color: themeStyles.textColor}]}>
              Profil
            </Text>
            <TouchableOpacity
              style={[
                styles.themeButton,
                isDarkMode && styles.themeButtonDark,
                {position: 'absolute', right: 20, top: 10},
              ]}
              onPress={toggleTheme}>
              <Text style={[styles.themeIcon, {color: themeStyles.textColor}]}>
                {isDarkMode ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.soundButton, isDarkMode && styles.soundButtonDark]}
              onPress={toggleSound}>
              <Text style={[styles.soundIcon, {color: themeStyles.textColor}]}>
                {isMuted ? '🔇' : '🔊'}
              </Text>
            </TouchableOpacity>
          </View>
          {currentTitle && (
            <Text style={styles.currentTitle}>{currentTitle}</Text>
          )}
        </View>

        <View
          style={[
            styles.statsContainer,
            {backgroundColor: themeStyles.cardBackground},
          ]}>
          <Text style={[styles.sectionTitle, {color: themeStyles.textColor}]}>
            İstatistikler
          </Text>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, {color: themeStyles.textColor}]}>
              Toplam Çözülen:
            </Text>
            <Text style={[styles.statValue, {color: themeStyles.textColor}]}>
              {progress.completed}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, {color: themeStyles.textColor}]}>
              4 Harfli Çözülen:
            </Text>
            <Text style={[styles.statValue, {color: themeStyles.textColor}]}>
              {progress.completed4}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, {color: themeStyles.textColor}]}>
              5 Harfli Çözülen:
            </Text>
            <Text style={[styles.statValue, {color: themeStyles.textColor}]}>
              {progress.completed5}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, {color: themeStyles.textColor}]}>
              Seviye:
            </Text>
            <Text style={[styles.statValue, {color: themeStyles.textColor}]}>
              {progress.level}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, {color: themeStyles.textColor}]}>
              Başarı Oranı:
            </Text>
            <Text style={[styles.statValue, {color: themeStyles.textColor}]}>
              %{progress.percentage}
            </Text>
          </View>
        </View>

        {certificates.length > 0 && (
          <View style={styles.certificatesContainer}>
            <Text style={[styles.sectionTitle, {color: themeStyles.textColor}]}>
              Sertifikalarım
            </Text>
            {certificates.map(cert => (
              <View
                key={cert.id}
                style={[
                  styles.certificate,
                  {
                    backgroundColor: isDarkMode
                      ? '#2c2c2c'
                      : 'rgba(248, 249, 250, 0.95)',
                    borderColor: isDarkMode ? '#4CAF50' : '#4CAF50',
                  },
                ]}>
                <View style={styles.certHeader}>
                  <Text style={styles.certIcon}>{cert.icon}</Text>
                  <Text
                    style={[
                      styles.certTitle,
                      {color: isDarkMode ? '#81C784' : '#4CAF50'},
                    ]}>
                    {cert.title}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.certDate,
                    {color: isDarkMode ? '#B0BEC5' : '#666'},
                  ]}>
                  {cert.date && cert.date instanceof Date
                    ? `Kazanıldı: ${cert.date.toLocaleDateString('tr-TR')}`
                    : 'Kazanıldı'}
                </Text>
                <Text
                  style={[
                    styles.certDetails,
                    {color: isDarkMode ? '#E0E0E0' : '#333'},
                  ]}>
                  {cert.details}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.contactCard,
            {backgroundColor: themeStyles.cardBackground},
          ]}
          onPress={handleContactPress}
          activeOpacity={0.7}>
          <View style={styles.contactContent}>
            <View style={styles.contactIconContainer}>
              <Text
                style={[styles.contactIcon, {color: themeStyles.textColor}]}>
                ✉️
              </Text>
            </View>
            <View
              style={[
                styles.contactTextContainer,
                {borderColor: themeStyles.borderColor},
              ]}>
              <Text
                style={[styles.contactTitle, {color: themeStyles.textColor}]}>
                İletişim
              </Text>
              <Text
                style={[
                  styles.contactDescription,
                  {color: themeStyles.textColor},
                ]}>
                Geri bildirimleriniz, iyileştirme önerileriniz veya hata
                raporlarınız için bizimle iletişime geçin.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    paddingVertical: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 10,
  },
  currentTitle: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginTop: 10,
  },
  statsContainer: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  certificatesContainer: {
    margin: 20,
    marginTop: 0,
  },
  certificate: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  certTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  certDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  certDetails: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [{scale: 1}],
  },
  contactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contactIcon: {
    fontSize: 24,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  themeButtonDark: {
    backgroundColor: '#3a3a3a',
  },
  themeIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 80,
    top: 10,
  },
  soundButtonDark: {
    backgroundColor: '#3a3a3a',
  },
  soundIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
});
