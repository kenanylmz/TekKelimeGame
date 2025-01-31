import Sound from 'react-native-sound';

// Ses kalitesi için
Sound.setCategory('Playback');

let isMutedState = false;
let backgroundMusicInstance = null;
let correctSoundInstance = null;
let wrongSoundInstance = null;

const SoundManager = {
  defaultVolume: 0.7,    // Arka plan müziği normal seviyesi
  loweredVolume: 0.1,    // Arka plan müziği kısık seviyesi
  effectVolume: 1.0,     // Efekt sesleri seviyesi

  // Sesleri yükle
  init() {
    // Arka plan müziği
    backgroundMusicInstance = new Sound(
      'background.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Arka plan müziği yüklenemedi:', error);
          return;
        }
        // Başarıyla yüklendiğinde sonsuz döngü ayarla
        backgroundMusicInstance.setNumberOfLoops(-1);
        backgroundMusicInstance.setVolume(this.defaultVolume);
        this.playBackgroundMusic();
      },
    );

    // Doğru cevap sesi
    correctSoundInstance = new Sound('right.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Doğru ses yüklenemedi:', error);
        return;
      }
      correctSoundInstance.setVolume(this.effectVolume);
    });

    // Yanlış cevap sesi
    wrongSoundInstance = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Yanlış ses yüklenemedi:', error);
        return;
      }
      wrongSoundInstance.setVolume(this.effectVolume);
    });
  },

  // Arka plan müziğini çal
  playBackgroundMusic() {
    if (!isMutedState && backgroundMusicInstance) {
      backgroundMusicInstance.play(success => {
        if (success) {
          console.log('Arka plan müziği başarıyla çalıyor');
        } else {
          console.log('Arka plan müziği oynatma hatası');
        }
      });
    }
  },

  // Arka plan müziğini geçici olarak kıs
  temporarilyLowerBackgroundMusic() {
    if (backgroundMusicInstance && !isMutedState) {
      backgroundMusicInstance.setVolume(this.loweredVolume);
    }
  },

  // Arka plan müziğini normal seviyesine getir
  restoreBackgroundMusic() {
    if (backgroundMusicInstance && !isMutedState) {
      let currentVolume = this.loweredVolume;
      const step = (this.defaultVolume - this.loweredVolume) / 10;
      
      const fadeIn = setInterval(() => {
        currentVolume += step;
        if (currentVolume >= this.defaultVolume) {
          currentVolume = this.defaultVolume;
          clearInterval(fadeIn);
        }
        backgroundMusicInstance.setVolume(currentVolume);
      }, 50);
    }
  },

  // Doğru cevap sesini çal
  playCorrectSound() {
    if (!isMutedState && correctSoundInstance) {
      this.temporarilyLowerBackgroundMusic();
      correctSoundInstance.stop();
      correctSoundInstance.play(success => {
        if (!success) {
          console.log('Doğru ses çalma hatası');
        }
        setTimeout(() => {
          this.restoreBackgroundMusic();
        }, 800);
      });
    }
  },

  // Yanlış cevap sesini çal
  playWrongSound() {
    if (!isMutedState && wrongSoundInstance) {
      this.temporarilyLowerBackgroundMusic();
      wrongSoundInstance.stop();
      wrongSoundInstance.play(success => {
        if (!success) {
          console.log('Yanlış ses çalma hatası');
        }
        setTimeout(() => {
          this.restoreBackgroundMusic();
        }, 800);
      });
    }
  },

  mute() {
    isMutedState = true;
    if (backgroundMusicInstance) {
      backgroundMusicInstance.setVolume(0);
    }
  },

  unmute() {
    isMutedState = false;
    if (backgroundMusicInstance) {
      backgroundMusicInstance.setVolume(this.defaultVolume);
      this.playBackgroundMusic();
    }
  },

  isMuted() {
    return isMutedState;
  },

  stopBackgroundMusic() {
    if (backgroundMusicInstance) {
      backgroundMusicInstance.stop();
    }
  },

  // Tüm sesleri temizle
  cleanup() {
    if (backgroundMusicInstance) {
      backgroundMusicInstance.stop();
      backgroundMusicInstance.release();
    }
    if (correctSoundInstance) {
      correctSoundInstance.stop();
      correctSoundInstance.release();
    }
    if (wrongSoundInstance) {
      wrongSoundInstance.stop();
      wrongSoundInstance.release();
    }
  },
};

export default SoundManager;
