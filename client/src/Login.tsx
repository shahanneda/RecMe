
import React from 'react'
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { RColors } from './RColors'

interface LoginProps {

}


const Login = (props: LoginProps) => {
    return (
        <View style={styles.container}>
            <Text>
                <View style={styles.errorView}>
                    <Text style={styles.errorText}>
                        Invalid Password/Username!
                    </Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="username"
                        placeholderTextColor={RColors.text}
                        onChangeText={(username) => { }}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor={RColors.text}
                        secureTextEntry={true}
                        onChangeText={(password) => { }}
                    />
                </View>

                {/* <TouchableOpacity>
                    <Text style={styles.forgot_button}>Forgot Password?</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
            </Text>
        </View >
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: RColors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        marginBottom: 40,
    },

    inputView: {
        backgroundColor: RColors.light,
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginBottom: 20,
        textAlign: "center",
        alignItems: "center",
        color: RColors.text,
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        textAlign: "center",
        color: RColors.text,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: RColors.accent,
    },
    loginText: {
        color: RColors.text,
    },
    errorText: {
        textAlign: "center",
        fontSize: 50,
        color: "red",
    },
    errorView:{
        margin: "15",
        padding: "200",
        backgroundColor: RColors.background2,
        borderStyle: 'solid',
        borderWidth:1,
        borderRadius:2,
        borderColor: "gray",

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
    }

})
