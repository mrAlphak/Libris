import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Animated, { BounceInDown, FadeIn, runOnJS } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../components/colors'
import Assets from '../assets/assets'
import Button from '../components/button'
import Link from '../components/link'

const Welcome =()=>{
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
            <View>
                <Assets.images.Item_1 height={350} width={350} />
            </View>
            <View style={{marginTop: 35}}>
                <Text style={{color: Colors.black, fontSize: 17, opacity: 0.9, fontFamily: 'Inter-SemiBold', textAlign: 'center'}}>Ouvrez vos horizons littéraires d'un simple tap.</Text>
                <Text style={{color: Colors.black, fontSize: 14, opacity: 0.9, fontFamily: 'Inter-Regular', textAlign: 'center', marginTop: 10}}>Embarquez pour une lecture sans limites et explorez des mondes entre les lignes avec Libris.</Text>
                <View style={{marginTop: 30}}>
                    <Button
                        text='Créer un compte'
                        backgroundColor={Colors.black}
                        color='white'
                        height={60}
                        onPress={()=>navigation.navigate('register')}
                    />                    
                </View>
                <Link onPress={()=>navigation.navigate('login')}>
                    <Text style={{color: Colors.black, fontSize: 13, opacity: 0.9, fontFamily: 'Inter-Medium', textAlign: 'center', marginTop: 10}}>Je possèdes déja un compte</Text>
                </Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25
    }
})


export default Welcome