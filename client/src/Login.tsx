
import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'

interface LoginProps {
    
}

const Login = (props: LoginProps) => {
    return (
        <View style={styles.container}>
            <StatusBar  />
            <Text>
                Login Page
            </Text>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
    }
})
