import { View, Text, StyleSheet } from 'react-native'
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated'
import Assets from '../assets/assets'
import Colors from './colors'

const Toast =({toast})=>{
    const Icon = Assets.icons[toast.icon]

    return ( 
        <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={[styles.toast, toast.position ? toast.position : {bottom: 80}]}>
            <Icon variant='Bulk' size={25} color={toast.iconColor} />
            <View>
                <Text style={{color: Colors.black, fontFamily: 'Inter-Medium', fontSize: 13}}>{toast.message}</Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    toast:{
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 12,
        paddingHorizontal: 12,
        paddingVertical: 7,
        backgroundColor: 'white',
        elevation: 1,
        flexDirection: 'row',
        borderColor: '#f1f1f1',
        borderWidth: 0.7,
        alignItems: 'center',
        gap: 7,
        borderRadius: 20
    }
})

export default Toast

