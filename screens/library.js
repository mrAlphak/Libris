import { SafeAreaView, StyleSheet, StatusBar, Text, View, Image, FlatList } from "react-native"
import { useSession } from "../providers/sessionProvider"
import { Book } from "./home"
import Ionicons from '@expo/vector-icons/Ionicons'
import Colors from '../components/colors'
import Button from '../components/button'
import Assets from '../assets/assets'


const Library =()=> {
    const {library, currentTheme, addToLibrary, removeFromLibrary, changeTheme} = useSession()

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>
            <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor='transparent' translucent />
            <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                    <Assets.icons.Book size={22} color="white" style={{opacity: 0.8}} />
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Inter-SemiBold'}}>Ma librairie</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter-Medium', opacity: 0.7}}>Retrouvez tous vos livres favoris</Text>
            </View>
            <View style={styles.main}>
                {
                    library.length === 0 &&
                    <View style={{gap: 7, paddingHorizontal: 30, marginTop: 50, alignSelf: 'center'}}>
                        <Image source={Assets.images.reading} style={{height: 300, width: 300}} />
                        <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.6, textAlign: 'center'}}>Votre librairie est vide. Ajoutez-y des livres à partir du bouton <Ionicons name='bookmark-outline' size={18} color={Colors[currentTheme].text} /></Text>
                    </View>
                }

                <View style={{marginTop: 25}}>
                    <FlatList  
                        data={library}
                        renderItem={({item})=><Book item={item} />}
                        keyExtractor={(item)=>item.identifier}
                        bounces={false}
                        numColumns={2}
                        columnWrapperStyle={{marginLeft: 25, gap: 35}}
                        contentContainerStyle={{gap: 35}}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{height: 50, width: '100%'}} />}
                    />                          
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        width: '100%',
        height: 120,
        paddingHorizontal: 20,
        paddingTop: 50,
        backgroundColor: Colors.green,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    main:{
        flex: 1,
    }
})

export default Library