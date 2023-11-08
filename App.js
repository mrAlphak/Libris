/*
  Libris, a book library app 📚
    - A complete library app built with react native and OpenLibrary. 
    - You'll find all the features you need in a library app.
  Enjoy coding! 🚀
  ----------------------

  https://www.linkedin.com/in/aka-joseph/
  https://github.com/mrAlphak
*/


import { useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SessionProvider } from './providers/sessionProvider'
import Screens from './screens/screens'
import Tabs from './components/tabs'
import loadFont from './components/fontsLoader'

LogBox.ignoreAllLogs()
const Stack = createNativeStackNavigator()

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    const loadAssets = async () => {
      const fontsLoaded = await loadFont()
      if (fontsLoaded) {
        setAssetsLoaded(true)
      }
    }
    loadAssets()
  }, [])

  return (
    assetsLoaded &&
      <NavigationContainer>
        <SessionProvider>
          <Stack.Navigator>
            <Stack.Screen name='splash' component={Screens.Splash} options={{ headerShown: false }} />
            <Stack.Screen name='welcome' component={Screens.Welcome} options={{ headerShown: false }} />
            <Stack.Screen name='main' component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name='preview' component={Screens.Preview} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name='category' component={Screens.Category} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name='search' component={Screens.Search} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name='viewer' component={Screens.Viewer} options={{ headerShown: false }} />
          </Stack.Navigator>          
        </SessionProvider>

      </NavigationContainer>
  )
}
