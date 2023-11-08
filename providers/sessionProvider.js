const { createContext, useState, useContext, useEffect } = require("react")
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from '../components/toast'

const SessionContext = createContext(null)
export const SessionProvider =({ children })=> {
    const [library, setLibrary] = useState([])
    const [isMounted, setIsMounted] = useState(false)
    const [toastQueue, setToastQueue] = useState([])
    const [currentTheme, setCurrentTheme] = useState('light')
    const [isConnected, setIsConnected] = useState(true)

    useEffect(() => {
        const fetchStorage =async()=>{
            const storedTheme = await AsyncStorage.getItem('theme')
            const storedLibrary = await AsyncStorage.getItem('library')
            if(storedLibrary){
                const data = JSON.parse(storedLibrary)
                setLibrary(data)
            }
            if(storedTheme){
                setCurrentTheme(storedTheme)
            }
            setIsMounted(true)
        }
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected)
        })

        fetchStorage()

        return()=>{
            unsubscribe()
        }
    }, [])

    useEffect(()=>{
        if(isMounted){
            AsyncStorage.setItem('library', JSON.stringify(library))
        }
    }, [library, isMounted])

    useEffect(()=>{
        if(isMounted){
            AsyncStorage.setItem('theme', currentTheme)
        }
    }, [currentTheme, isMounted])

    const addToLibrary =async(item)=>{
        if(item && item.identifier){
            const arr = [...library]
            const itemExist = arr.some(prev => prev.identifier === item.identifier)
            if(itemExist){
                showToast({
                    message: "Ce livre existe déja dans votre librairie",
                    icon: 'EmojiSad',
                    iconColor: 'orangered',
                    duration: 2000
                })
                return false
            }else{
                setLibrary(prev => [...prev, item])
                showToast({
                    message: "Livre ajouté à votre librairie",
                    icon: 'EmojiHappy',
                    iconColor: '#00A693',
                    duration: 2000
                })
                return true
            }
        }else{
            return null
        }
    }

    const removeFromLibrary =async(item)=>{
        if(item && item.identifier){
            let arr = [...library]
            let newArr = arr.filter(prev => prev.identifier !== item.identifier)
            setLibrary(newArr)
            showToast({
                message: "Livre retiré de votre librairie",
                icon: 'EmojiHappy',
                iconColor: '#00A693',
                duration: 2000
            })
            return true
        }
        return null
    }

    const changeTheme =()=>{
        if(currentTheme === 'light'){
            setCurrentTheme('dark')
        }else{
            setCurrentTheme('light')
        }
        
        showToast({
            message: "Thème mis à jour",
            icon: 'EmojiHappy',
            iconColor: '#00A693',
            duration: 2000
        })
    }

    useEffect(()=>{
        console.log(currentTheme)
    }, [currentTheme])

    const showToast = ({message, icon, iconColor, position, duration}) => {
        setToastQueue(oldQueue => [...oldQueue, {
            message,
            icon,
            iconColor,
            position,
        }])

        setTimeout(() => {
            setToastQueue(oldQueue => oldQueue.slice(1));
        }, duration)
    }
    

    return (
        <SessionContext.Provider value={{library, currentTheme, addToLibrary, removeFromLibrary, changeTheme, toast: toastQueue[0], showToast}}>
            {children}
            {toastQueue[0] && <Toast toast={toastQueue[0]} />}
        </SessionContext.Provider>
    )
}

export const useSession =()=>{
    return useContext(SessionContext)
}