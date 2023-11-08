import { StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import Assets from "../assets/assets"


const Button=({
    width,
    height,
    backgroundColor,
    color,
    icon,
    iconVariant,
    iconSize,
    iconRotation,
    text,
    paddingHorizontal,
    elevation,
    onPress,
    disabled,
    borderRadius,
    fontSize,
    justifyContent,
    fontFamily,
    textOpacity,
    overflow
    })=>{
    const CustomIcon = icon ? Assets.icons[icon] : ''

    return (
        <Pressable
            disabled={disabled}
            onPress={()=>onPress()}
            style={({ pressed })=>[
                styles.container,
                {justifyContent: justifyContent ? justifyContent : 'center'},
                {width, height, elevation, backgroundColor},
                paddingHorizontal && {paddingHorizontal: 15},
                pressed && {opacity: 0.8},
                disabled && {opacity: 0.8},
                {borderRadius: borderRadius ? borderRadius : 15},
                overflow && {overflow: 'hidden'}
            ]}
        >
            {icon && <CustomIcon color={color} variant={iconVariant} size={iconSize} style={iconRotation && { transform: [{ rotate: iconRotation } ] }} /> }
            {text && <Text numberOfLines={1} style={[styles.text, icon && {paddingLeft: 15}, {color, fontSize: fontSize ? fontSize : 14, fontFamily: fontFamily ? fontFamily : 'Inter-SemiBold', opacity: textOpacity ? textOpacity : 1}]}>{text}</Text>}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        flexDirection: 'row',
    },
    text:{
    }
})

export default Button
