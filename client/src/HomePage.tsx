import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Button, Header, Text, withTheme, useTheme } from 'react-native-elements'
import Login, { LoginInfo } from './Login';

interface Props {
    setLoginInfo: (info: LoginInfo) => void
}

const HomePage = (props: Props) => {
        const { theme } = useTheme();
        const [loginShowing, setLoginShowing] = useState(false);
    return (
        <View>
            <Header containerStyle={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
            }}>
                <Button
                    buttonStyle={{
                        backgroundColor: theme?.colors?.secondary,
                        justifyContent:'center',
                        borderRadius:1,
                    }}
                    title="Join"
                    type="solid"
                    onPress={() =>{
                         setLoginShowing(!loginShowing)
                    }}
                />

                <Text h1 h1Style={{
                    color:"white",
                    fontStyle:"italic",
                }}>
                    RecMe
                </Text>
            </Header>



            {loginShowing? <Login onClose={() => {setLoginShowing(false)} } setLoginInfo={props.setLoginInfo} /> : ""}

        </View>
    )
}

export default HomePage;

const styles = StyleSheet.create({})
