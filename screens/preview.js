import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Image, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../providers/sessionProvider'
import Animated, { FadeInDown, FadeOutDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../components/colors'
import Button from '../components/button'
import Assets from '../assets/assets'
import Loader from '../components/loader'
import useAxios from '../hooks/axios'


const Preview =({route})=>{
    const { key, title, authors, identifier, publish_year, ia, cover_id } = route.params
    const { library, currentTheme, addToLibrary, removeFromLibrary, changeTheme } = useSession()
    const navigation = useNavigation()
    const scaleY = useSharedValue(400)
    const [isExpanded, setIsExpanded] = useState(false)
    const [inLibrary, setInLibrary] = useState(false)
    const { fetchData } = useAxios()
    const [loading, setLoading] = useState(false)
    const [coverLoaded, setCoverLoaded] = useState(false)
    const [book, setBook] = useState(null)
    const [authorInfos, setAuthorInfos] = useState(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        const getBook =async()=>{
            setLoading(true)
            const bookData = await fetchData('http://openlibrary.org'+key+'.json', null, 'get')
            const authorData = await fetchData('https://openlibrary.org/'+authors[0].key+'.json', null, 'get')
            if(bookData){
                setBook(bookData)
            }
            authorData && setAuthorInfos(authorData)
            setLoading(false)
            setIsMounted(true)
        }
        !isMounted && getBook()
    }, [])

    useEffect(()=>{
        if(library.length > 0){
            let arr = [...library]
            let isExist = arr.some(prev => prev.identifier === identifier)
            setInLibrary(isExist)
        }else{
            setInLibrary(false)
        }
    }, [library])

    const updateLibrary =async()=>{
        if(book){
            if(!inLibrary){
                const results = await addToLibrary(route.params)
                console.log(results)                
            }else{
                const results = await removeFromLibrary(route.params)
                console.log(results)     
            }
        }
    }

    const openViewer =()=>{
        navigation.navigate('viewer', {identifier, cover_id})
    }

    const expand =()=>{
        scaleY.value = withTiming(600, {duration: 600})
        setIsExpanded(true)
    }

    const reduce =()=>{
        scaleY.value = withTiming(400, {duration: 400})
        setIsExpanded(false)
    }

    const bottomContainerAnimation = useAnimatedStyle (()=>{
        return {
            height: scaleY.value
        }
    })

    
    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>
            <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor='transparent' translucent />
            <View style={[styles.header, {backgroundColor: Colors[currentTheme].input}]}>
                <Button
                    icon='ArrowLeft'
                    iconSize={25}
                    iconVariant='Linear'
                    color={Colors[currentTheme].text}
                    height={40}
                    width={30}
                    onPress={() => navigation.goBack()}
                />
                <Text style={{color: Colors[currentTheme].text, fontSize: 15, fontFamily: 'Inter-Medium', opacity: 0.9}}>Details</Text>
                <View style={{height: 50, width: 30}} />
            </View>         
            {
                loading ? 
                <Loader />
                :
                book && authorInfos &&
                <View style={styles.main}>
                    <View style={{flex: 1}}>
                        <View style={[styles.coverContainer, {backgroundColor: Colors[currentTheme].input}]}>
                            <Animated.View sharedTransitionTag={`id-${cover_id}`} style={styles.bookCover}>
                                <Image onLoad={()=>setCoverLoaded(true)} source={{uri: 'https://covers.openlibrary.org/b/id/'+cover_id+'-M.jpg'}} resizeMode='contain' style={{height: '100%', width: '100%', borderRadius: 15}} />
                            </Animated.View>
                            {
                                !coverLoaded &&
                                <View style={{height: '100%', width: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
                                    <ActivityIndicator size="small" color={Colors.green} />
                                </View>
                            }
                        </View>
                        <Animated.View style={[styles.bottomContainer, bottomContainerAnimation, {backgroundColor: Colors[currentTheme].background}]}>  
                            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                                <Text style={{ color: Colors[currentTheme].text, fontSize: 20, fontFamily: 'Inter-SemiBold', opacity: 0.9}}>{title}</Text>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15}}>
                                        <Image source={{uri: 'https://covers.openlibrary.org/b/id/'+authorInfos.photos[0]+'-M.jpg'}} style={styles.authorCover} />
                                        <View>
                                            <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.7, marginTop: 5}}>Par {authors[0].name}</Text>
                                            <Text style={{ color: Colors[currentTheme].text, fontSize: 13, fontFamily: 'Inter-Regular', opacity: 0.7, marginTop: 2}}>{publish_year}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ color: Colors[currentTheme].text, fontSize: 13, fontFamily: 'Inter-SemiBold', opacity: 0.8, marginTop: 25}}>Description</Text>
                                <Text numberOfLines={!isExpanded ? 5 : 25} style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.9, marginTop: 10, textAlign: 'justify', lineHeight: 20}}>{book.description ? book.description.value  || book.description : 'Indisponible'}</Text>                   
                                {
                                    isExpanded && 
                                    <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-SemiBold', opacity: 0.8}}>Personnages: </Text>
                                            {book.subject_people ? 
                                                <ScrollView bounces={false} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{gap: 5}} style={{flexDirection: 'row' , marginTop: 10}}>
                                                    {
                                                        book.subject_people.map((subject, id) => 
                                                            id < 8 && <View key={id} style={styles.subject}>
                                                                <Text style={{color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 12,}}>{subject}</Text>
                                                            </View>                                           
                                                        )
                                                    }                                
                                                </ScrollView> :  
                                                <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.8, marginTop: 10}}>Indisponible</Text>
                                            }
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-SemiBold', opacity: 0.8}}>Lieux: </Text>
                                            {book.subject_places ? 
                                                <ScrollView bounces={false} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{gap: 5}} style={{flexDirection: 'row' , marginTop: 10}}>
                                                    {
                                                        book.subject_places.map((subject, id) => 
                                                            id < 8 && <View key={id} style={styles.subject}>
                                                                <Text style={{color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 12,}}>{subject}</Text>
                                                            </View>                                           
                                                        )
                                                    }                                
                                                </ScrollView> :  
                                                <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.8, marginTop: 10}}>Indisponible</Text>
                                            }
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-SemiBold', opacity: 0.8}}>Sujets: </Text>
                                            {book.subjects ? 
                                                <ScrollView bounces={false} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{gap: 5}} style={{flexDirection: 'row' , marginTop: 10}}>
                                                    {
                                                        book.subjects.map((subject, id) => 
                                                            id < 8 && <View key={id} style={styles.subject}>
                                                                <Text style={{color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 12}}>{subject}</Text>
                                                            </View>                                           
                                                        )
                                                    }                                
                                                </ScrollView> :  
                                                <Text style={{ color: Colors[currentTheme].text, fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.8, marginTop: 10}}>Indisponible</Text>
                                            }
                                        </View>
                                        <View style={{height: 80, width: '100%'}} />
                                    </Animated.View>                            
                                }
                            </ScrollView>
                            <View style={{ backgroundColor: Colors[currentTheme].background, flexDirection: 'row', justifyContent: 'center', gap: 20,  alignItems: 'center',  position: 'absolute', bottom: 10, width: '100%', alignSelf: 'center' }}>
                                <Button
                                    backgroundColor={Colors.green}
                                    color='white'
                                    text={identifier ? 'Lire' : 'Indisponible'}
                                    height={55}
                                    width='80%'
                                    disabled={loading || !identifier}
                                    onPress={()=> openViewer()}
                                />                            
                                <Button
                                    backgroundColor={!inLibrary ? Colors[currentTheme].input : Colors.green}
                                    text={<Ionicons name={!inLibrary ? 'bookmark-outline' : 'bookmark'} size={22} color={!inLibrary ? Colors[currentTheme].text : 'white'}/>}
                                    height={55}
                                    width='17%'
                                    onPress={()=> updateLibrary()}
                                    disabled={loading}
                                />
                            </View> 
                            <View style={styles.expandBtn}>
                                <Button
                                    icon={!isExpanded ? "ArrowUp2" : "ArrowDown2"}
                                    iconVariant='Linear'
                                    iconSize={18}
                                    color='white'
                                    borderRadius={100}
                                    height={35}
                                    width={35}
                                    backgroundColor={Colors.green}
                                    elevation={5}
                                    onPress={()=> !isExpanded ? expand() : reduce()}
                                />
                            </View>    
                        </Animated.View>                    
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
    header: {
        width: '100%',
        height: 80,
        paddingTop: 40,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    main:{
        flex: 1,
    },
    bookCover:{
        height: 230, 
        width: 160,
        borderRadius: 15,
        elevation: 3
    },
    coverContainer:{
        width: '100%',
        height: '50%',
        alignItems: 'center',
        paddingTop: 30,
    },
    bottomContainer:{
        height: 400,
        width: '100%',
        elevation: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 20,
        paddingTop: 50
    },
    authorCover:{
        height: 40,
        width: 40,
        borderRadius: 100
    },
    expandBtn:{
        position: 'absolute',
        zIndex: 5,
        alignSelf: 'center',
        top: -15
    },
    subject:{
        backgroundColor: Colors.blue,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 100
    }
})

export default Preview