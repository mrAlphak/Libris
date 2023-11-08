import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../providers/sessionProvider'
import Animated, { BounceInDown, FadeIn } from 'react-native-reanimated'
import Colors from '../components/colors'
import Assets from '../assets/assets'
import loadFont from '../components/fontsLoader'



const Splash =()=>{
    const [showText, setShowText] = useState(false)
    const { currentTheme } = useSession()
    const navigation = useNavigation()

    useEffect(()=>{
        let timeout = setTimeout(()=>{
            setShowText(true)          
        }, 300)

        return()=>clearTimeout(timeout)
    }, [])

    useEffect(()=>{
        if(showText){
            let timeout = setTimeout(()=>{
                loadFont()
                .then(()=>{
                    navigation.replace('main')
                })
                .catch((error)=>{
                    console.log('failed to load fonts :',error)
                })  
            }, 300)
            return()=>clearTimeout(timeout)
        }
    }, [showText])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
            <Animated.View entering={BounceInDown}>
                <Assets.images.Icon height={120} width={120} />
            </Animated.View>
            {showText && <Animated.Text entering={FadeIn.duration(500)} style={{position: 'absolute', paddingTop: 150, color:'white', fontSize: 30, fontFamily: 'Inter-Bold'}}>Libris</Animated.Text>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.green,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Splash