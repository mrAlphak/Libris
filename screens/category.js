import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Book } from './home'
import { useSession } from '../providers/sessionProvider'
import useAxios from '../hooks/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/loader'
import Colors from '../components/colors'
import Button from '../components/button'
import Assets from '../assets/assets'


const Category =({route})=>{
    const [books, setBooks] = useState([])
    const [limit, setLimit] = useState(15)
    const {subject, title} = route.params
    const {currentTheme} = useSession()
    const { fetchData } = useAxios()
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const navigation = useNavigation()

    useEffect(()=>{
        const getBooks =async(url)=>{
            setLoading(true)
            fetchData(url, null, 'get')
            .then((data)=>{
                let arr = []
                data.works.forEach(d => {
                    if(d.availability){
                        let book = {
                            key: d.key,
                            identifier: d.availability.identifier,
                            cover_id: d.cover_id,
                            authors: d.authors,
                            title: d.title,
                            publish_year: d.first_publish_year,
                            ia: d.ia,
                            subject: d.subject 
                        }   
                        arr.push(book)                      
                    }
                })
                setBooks(arr)
                setLoading(false)
            })
            .catch((err)=>{
                setLoading(false)
                console.log(err)
            })
            setIsMounted(true)
        }

        if(!isMounted){
            getBooks(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`)                
        }
    }, [])

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>
            <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor='transparent' translucent />
            <View style={styles.header}>
                <Button
                    icon='ArrowLeft'
                    iconSize={25}
                    iconVariant='Linear'
                    color={Colors[currentTheme].text}
                    height={40}
                    width={30}
                    onPress={() => navigation.goBack()}
                />
                <Text style={{ color: Colors[currentTheme].text, fontSize: 20, fontFamily: 'Inter-SemiBold', opacity: 0.9, marginLeft: 5}}>{title}</Text>
            </View>
            {
                loading ? 
                <Loader /> 
                : 
                books.length > 0 &&
                <View style={styles.main}>
                    <View style={{marginTop: 25}}>
                        <FlatList  
                            data={books}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            numColumns={2}
                            columnWrapperStyle={{marginLeft: 25, gap: 35}}
                            contentContainerStyle={{gap: 35}}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={<View style={{height: 50, width: '100%'}} />}
                        />                          
                    </View>
                </View>
            }
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        width: '100%',
        height: 90,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    main:{
        flex: 1,
        alignItems: 'center'
    },
    categoryHeader:{
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    book:{
        height: 260,
        width: 150,
    },
    bookCover:{
        height: '100%', 
        width: '80%',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'lightgray',
    },
    mainBook:{
        width: '100%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerBook:{
        width: '100%',
        height: '30%',
        paddingTop: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        overflow: 'hidden',
    }
})

export default Category