import { useEffect, useState, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Text} from "react-native"
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { useSession } from "../providers/sessionProvider"
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import Screens from '../screens/screens'
import Colors from "./colors"
import Assets from '../assets/assets'


const Tab = createBottomTabNavigator()

const Tabs =({route})=>{
    const {currentTheme} = useSession()

    return ( 
    <Tab.Navigator 
        screenOptions={({ route })=>({
            tabBarStyle: [styles.navigator, {backgroundColor: Colors[currentTheme].background}], 
            headerShown: false,
        })}
    >
        <Tab.Screen
            name='Home'
            component={Screens.Home}
            initialParams={route.params}
            options={{ 
                tabBarButton: (props)=>{
                    return <TabButton 
                        title='Explorer'
                        icon='Home2'
                        {...props}
                    /> 
                } 
            }}
        />
        <Tab.Screen
            name='Discover'
            component={Screens.Search}
            initialParams={route.params}
            options={{ 
                unmountOnBlur: true,
                tabBarButton: (props)=>{
                    return <TabButton 
                        title='Rechercher'
                        icon='SearchNormal1'
                        size={25}
                        {...props}
                    /> 
                } 
            }}
        />
        <Tab.Screen
            name='Library'
            component={Screens.Library}
            initialParams={route.params}
            options={{ 
                unmountOnBlur: true,
                tabBarButton: (props)=>{
                    return <TabButton 
                        title='Ma librairie'
                        icon='Book'
                        size={27}
                        {...props}
                    /> 
                } 
            }}
        />
    </Tab.Navigator>
    )
}

const TabButton =(props)=>{
    const {onPress, accessibilityState} = props
    const {currentTheme} = useSession()
    const focused = accessibilityState.selected
    const Icon = Assets.icons[props.icon] 

    const handlePress=()=>{
        onPress()
    }

    return (
        <TouchableOpacity onPress={()=>handlePress()} style={[styles.tabButton]}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Icon variant={focused ? 'Bulk' : 'Linear'} color={focused ? Colors.green : Colors[currentTheme].text_2} size={props.size || 30} />
                {focused && <Animated.Text entering={FadeIn} exiting={FadeOut} style={[styles.tabLabel, {color: Colors.green}]}>{props.title}</Animated.Text>}
            </View> 
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    navigator:{
        height: 80,
        elevation: 9,
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: 'transparent',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    tabButton:{
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    tabLabel:{
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    newPostButton:{
        height: '65%',
        width: '60%',
        borderRadius: 10,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Tabs