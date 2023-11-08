import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../providers/sessionProvider'
import Animated, { FadeInDown, FadeOutDown, Layout, SequencedTransition } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/loader'
import Colors from '../components/colors'
import Button from '../components/button'
import Assets from '../assets/assets'
import useAxios from '../hooks/axios'

const Home =()=>{
    const { fetchData } = useAxios()
    const { currentTheme, changeTheme } = useSession()
    const [adventureCategory, setAdventureCategory] = useState([])
    const [loveCategory, setLoveCategory] = useState([])
    const [horrorCategory, setHorrorCategory] = useState([])
    const [historyCategory, setHistoryCategory] = useState([])
    const [mysteryCategory, setMysteryCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const navigation = useNavigation()

    useEffect(()=>{
        const getBooks =async(url, setState)=>{
            setLoading(true)
            fetchData(url, null, 'get')
            .then((data)=>{
                let arr = [{key: 'start'}]
                data.works.forEach(d => {
                    if(d.availability){
                        let book = {
                            key: d?.key,
                            identifier: d?.availability?.identifier,
                            cover_id: d?.cover_id,
                            authors: d?.authors,
                            title: d?.title,
                            publish_year: d?.first_publish_year,
                            ia: d?.ia,
                            subject: d?.subject 
                        }   
                        arr.push(book)                      
                    }
                })
                setState(arr)
                setLoading(false)
            })
            .catch((err)=>{
                setLoading(false)
                console.log(err)
            })
            setIsMounted(true)
        }

        if(!isMounted){
            getBooks('https://openlibrary.org/subjects/love.json?limit=7', setLoveCategory)
            getBooks('https://openlibrary.org/subjects/horror.json?limit=7', setHorrorCategory)                        
            getBooks('https://openlibrary.org/subjects/adventure.json?limit=7', setAdventureCategory)      
            getBooks('https://openlibrary.org/subjects/mystery.json?limit=7', setMysteryCategory)      
            getBooks('https://openlibrary.org/subjects/history.json?limit=7', setHistoryCategory)                  
        }
    }, [])

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>
            <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor='transparent' translucent />
            <View style={styles.header}>
                <Text style={{ color: Colors[currentTheme].text, fontSize: 25, fontFamily: 'Inter-SemiBold', opacity: 0.9}}>Explorer</Text>
                <Button
                    icon={currentTheme  === 'light' ? 'Sun1' : 'Moon'}
                    height={40}
                    width={40}
                    color={Colors[currentTheme].text}
                    onPress={()=> changeTheme()}
                    backgroundColor={Colors[currentTheme].input}
                />
            </View>
            <View style={styles.main}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                    <Animated.View layout={SequencedTransition}>
                        {
                            adventureCategory.length > 0 &&
                            <View style={styles.categoryHeader}>
                                <Text style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 18, fontFamily: 'Inter-SemiBold'}}>Aventure</Text>
                                <Button
                                    icon='ArrowRight2'
                                    iconVariant='Linear'
                                    iconSize={20}
                                    height={40}
                                    color={Colors[currentTheme].text}
                                    onPress={()=> navigation.navigate('category', {subject: 'adventure', title: 'Aventure'})}
                                />
                            </View>
                        }
                        <FlatList  
                            data={adventureCategory}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />                    
                    </Animated.View>
                    <Animated.View layout={SequencedTransition} style={{marginTop: 25}}>
                        {
                            loveCategory.length > 0 &&
                            <View style={styles.categoryHeader}>
                                <Text style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 18, fontFamily: 'Inter-SemiBold'}}>Romance</Text>
                                <Button
                                    icon='ArrowRight2'
                                    iconVariant='Linear'
                                    iconSize={20}
                                    height={40}
                                    color={Colors[currentTheme].text}
                                    onPress={()=> navigation.navigate('category', {subject: 'love', title: 'Romance'})}
                                />
                            </View>
                        }
                        <FlatList  
                            data={loveCategory}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />                          
                    </Animated.View>  
                    <Animated.View layout={SequencedTransition} style={{marginTop: 25}}>
                       { 
                            horrorCategory.length > 0 &&
                            <View style={styles.categoryHeader}>
                                <Text style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 18, fontFamily: 'Inter-SemiBold'}}>Frissons</Text>
                                <Button
                                    icon='ArrowRight2'
                                    iconVariant='Linear'
                                    iconSize={20}
                                    height={40}
                                    color={Colors[currentTheme].text}
                                    onPress={()=> navigation.navigate('category', {subject: 'horror', title: 'Frissons'})}
                                />
                            </View>
                        }
                        <FlatList  
                            data={horrorCategory}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />                        
                    </Animated.View> 
                    <Animated.View layout={SequencedTransition} style={{marginTop: 25}}>
                        {
                            mysteryCategory.length > 0 &&
                            <View style={styles.categoryHeader}>
                                <Text style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 18, fontFamily: 'Inter-SemiBold'}}>Intrigue</Text>
                                <Button
                                    icon='ArrowRight2'
                                    iconVariant='Linear'
                                    iconSize={20}
                                    height={40}
                                    color={Colors[currentTheme].text}
                                    onPress={()=> navigation.navigate('category', {subject: 'mystery', title: 'Intrigue'})}
                                />
                            </View>
                        }
                        <FlatList  
                            data={mysteryCategory}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />                       
                    </Animated.View> 
                    <Animated.View layout={SequencedTransition} style={{marginTop: 25}}>
                       {
                            historyCategory.length > 0 &&
                            <View style={styles.categoryHeader}>
                                <Text style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 18, fontFamily: 'Inter-SemiBold'}}>Histoire</Text>
                                <Button
                                    icon='ArrowRight2'
                                    iconVariant='Linear'
                                    iconSize={20}
                                    height={40}
                                    color={Colors[currentTheme].text}
                                    onPress={()=> navigation.navigate('category', {subject: 'history', title: 'Histoire'})}
                                />
                            </View>
                        }
                        <FlatList  
                            data={historyCategory}
                            renderItem={({item})=><Book item={item} />}
                            keyExtractor={(item)=>item.key}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />                       
                    </Animated.View>
                    <View style={{height: 200, width: '100%'}} />             
                </ScrollView>
                {
                    loading && 
                    <View style={{position: 'absolute', height: '90%', width: '100%'}}>
                        <Loader/>
                    </View>
                }  
            </View>
        </SafeAreaView>
    )
}

export const Book =({item})=>{
    const navigation = useNavigation()
    const {currentTheme} = useSession()
    const [isLoaded, setIsLoaded] = useState(false)
    const onPress =()=>{
        navigation.navigate('preview', item)
    }
    return (
        item.title ?
        <TouchableOpacity onPress={()=>onPress()} style={styles.book}>
            <View style={styles.mainBook}>                 
                <Image onLoad={()=> setIsLoaded(true)} source={{uri: 'https://covers.openlibrary.org/b/id/'+item.cover_id+'-M.jpg'}} resizeMode='contain' style={[styles.bookCover, {borderColor: Colors[currentTheme].text_2}]} />
                {
                    !isLoaded &&
                    <View style={{height: '100%', width: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="small" color={Colors.green} />
                    </View>
                }
            </View>
            <View style={styles.footerBook}>
                <Text numberOfLines={1} style={{color: Colors[currentTheme].text, opacity: 0.7, fontSize: 13, fontFamily: 'Inter-Regular'}}>Par {item.authors[0].name}</Text>
                <Text numberOfLines={2} style={{color:Colors[currentTheme].text, opacity: 0.9, fontSize: 15, fontFamily: 'Inter-Medium', paddingTop: 5}}>{item.title}</Text>
            </View>
        </TouchableOpacity> : 
        <View style={{width: 20, height: 260}} />
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        width: '100%',
        height: 120,
        paddingHorizontal: 20,
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    main:{
        flex: 1,
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
        width: 120,
        marginRight: 35
    },
    bookCover:{
        height: '100%', 
        width: '100%',
        borderRadius: 20,
        borderWidth: 0.5,
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
    }
})

export default Home