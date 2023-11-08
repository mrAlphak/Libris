import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeOutDown, FadeIn } from 'react-native-reanimated'
import { useForm } from "react-hook-form"
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../providers/sessionProvider'
import { Book } from './home'
import Loader from '../components/loader'
import Input from '../components/input'
import Colors from '../components/colors'
import Button from '../components/button'
import Assets from '../assets/assets'
import useAxios from '../hooks/axios'

const Search =()=>{
    const { fetchData } = useAxios()
    const [books, setBooks] = useState([])
    const { control, setError, clearErrors, getValues, formState } = useForm({ mode: 'onSubmit' })
    const { errors } = formState
    const {currentTheme} = useSession()
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const navigation = useNavigation()

    const onChange=({value})=>{
        let timeout
        if(value && value.length > 3){
            setLoading(true)
            clearErrors('search')
            fetchData('https://openlibrary.org/search.json?q='+value+'&fields=*,availability&limit=20', null, 'get')
            .then((results)=>{
                if(results){
                    if(results.docs.length > 0){
                        results.docs.forEach(book => {
                            if(book.availability){
                                const doc = {
                                    key: book?.key,
                                    identifier: book?.availability?.identifier,
                                    cover_id: book?.cover_i,
                                    authors: [
                                        {
                                            key: `/authors/${book?.author_key[0]}`,
                                            name: book?.author_name[0],
                                        }
                                    ],
                                    title: book?.title,
                                    publish_year: book?.first_publish_year,
                                    ia: book?.ia[0],
                                    subject: book?.subject 
                                }
                                setBooks(prev => [...prev, doc])
                            }
                        })
                    }else{
                        setError('search', {message: 'Aucun resultat ne correspond à votre recherche'})
                    }
                }else{
                    setError('search', {message: 'Aucun resultat ne correspond à votre recherche'})
                }
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setError('search', {message: 'Une erreur est survenue, veuillez-réessayer'})
                setLoading(false)
            })    
        }
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: Colors[currentTheme].background}]}>
            <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor='transparent' translucent />
            <View style={styles.header}>
                <Animated.View entering={FadeInLeft.duration(500)} style={{marginTop: 10}}>
                    <Input
                        control={control}
                        name='search'
                        icon='SearchNormal1'
                        iconVariant='Linear'
                        iconSize={20}
                        iconColor='gray'
                        color={Colors[currentTheme].text}
                        placeholder="Rechercher..."
                        width='100%'
                        height={55}
                        backgroundColor={Colors[currentTheme].input}
                        handleChange={({ name, value }) => onChange({ name, value })}
                    />
                </Animated.View>
            </View>
            <View style={styles.main}>
                {
                    !loading && books.length === 0 &&
                    errors.search && <Text style={{fontFamily: 'Inter-Regular', marginTop: 15, fontSize: 14, color: Colors[currentTheme].black, textAlign: 'center'}}>{errors.search.message}</Text>
                }
                <View style={{marginTop: 25}}>
                    <FlatList  
                        data={books}
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

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        width: '100%',
        height: 130,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    main:{
        flex: 1,
        alignItems: 'center', 
    },
})

export default Search