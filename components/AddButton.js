import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Animated } from "react-native";

const AddButton = () => {
    buttonSize = new Animated.Value(1);
    mode = new Animated.Value(0);
    const handlePress = () => {
        Animated.sequence([
            Animated.timing(this.buttonSize, {
                toValue: 0.95,
                duration: 200,
            }),
            Animated.timing(this.buttonSize, {
                toValue: 1
            })
        ]).start();
    }
    const sizeStyle = {
        transform: [{scale: this.buttonSize}]
    };
    const rotation = this.mode.interpolate({
        inputRange: [0,1],
        outputRange: ["0deg", "45deg"]
    })
    return (
        <View>
            <TouchableOpacity onPress={handlePress}>
                <Text>Add</Text>
            </TouchableOpacity>
        </View>
    )
}
export default AddButton