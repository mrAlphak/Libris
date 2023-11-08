import { useEffect, useState } from "react"
import { SafeAreaView, Image, View, StyleSheet, Text, ImageBackground, Dimensions, StatusBar } from "react-native"
import { useSession } from "../providers/sessionProvider"
import { WebView } from "react-native-webview"
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated"
import Colors from "../components/colors"
import Loader from "../components/loader"
import Assets from "../assets/assets"

const Viewer =({route})=>{
    const [isMounted, setIsMounted] = useState(false)
    const {identifier, cover_id} = route.params
    const {currentTheme} = useSession()

    useEffect(()=>{
        let timeout = setTimeout(()=>{
            setIsMounted(true)
        }, 1800)

        return()=> clearTimeout(timeout)
    }, [])

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>      
            <View style={styles.main}>
                <Animated.View sharedTransitionTag={`id-${cover_id}`} style={styles.bookCover}>
                    <Image source={{uri: 'https://covers.openlibrary.org/b/id/'+cover_id+'-M.jpg'}} resizeMode='contain' style={{height: '100%', width: '100%', borderRadius: 15}} />
                </Animated.View>
                <Text style={{color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Medium', opacity: 0.7, marginTop: 15}}>Chargement..</Text>
            </View>
            <WebView                  
                source={{uri: `https://archive.org/details/${identifier}/mode/1up?view=theater`}} 
                androidHardwareAccelerationDisabled={true}
                style={{flex: 1, marginTop: StatusBar.currentHeight, opacity: isMounted ? 1 : 0}} 
            />         
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    main:{
        height: '100%',
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bookCover:{
        height: 230, 
        width: 160,
        borderRadius: 15,
        elevation: 5
    },
})

export default Viewer