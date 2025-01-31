import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Image} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import GameScreen4 from './screens/GameScreen4';
import GameScreen5 from './screens/GameScreen5';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import {useGame} from './context/GameContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="MainApp"
        component={HomeScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="GameScreen4"
        component={GameScreen4}
        options={{
          title: '4 Harfli Oyun',
          headerStyle: {
            backgroundColor: '#1a1a1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="GameScreen5"
        component={GameScreen5}
        options={{
          title: '5 Harfli Oyun',
          headerStyle: {
            backgroundColor: '#1a1a1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function Router() {
  const {isDarkMode} = useGame();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = require('./assets/home.png');
            } else if (route.name === 'Profile') {
              iconSource = require('./assets/profile.png');
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  tintColor: color,
                }}
              />
            );
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: isDarkMode ? '#888' : 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1a1a1b' : '#fff',
            borderTopColor: isDarkMode ? '#404040' : '#e0e0e0',
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{title: 'Ana Sayfa'}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: 'Profil'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
