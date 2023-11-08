import { View, Text, Image, StyleSheet } from 'react-native'
import { useSession } from '../providers/sessionProvider'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import Colors from './colors'
import Assets from '../assets/assets'

const Loader =()=>{
    const {currentTheme} = useSession()
    return (
        <View style={[styles.loader, {backgroundColor: Colors[currentTheme].background}]}>
            <Animated.Image entering={FadeInDown} exiting={FadeOutDown} source={Assets.images.loader} style={[{height: 40, width: 40}, currentTheme === 'dark' && {tintColor: 'white'}]} />
            <Text style={{color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Medium', opacity: 0.7}}>Chargement..</Text>
        </View> 
    )
}

const styles = StyleSheet.create({
    loader:{
        height: '100%',
        width: '100%',
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center'
    },
})

export default Loader