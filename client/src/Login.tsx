
import React, { useContext, useState } from 'react'
import { GestureResponderEvent, StatusBar, StyleSheet, View } from 'react-native'
import { RColors } from './RColors'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Button, Input, Text } from 'react-native-elements';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { ServerInfo, ServerInfoContext } from './ServerInfo';


interface LoginProps {
    onClose: () => void,
    setLoginInfo: (info: LoginInfo) => void,
}



const Login:React.FC<LoginProps> = (props: LoginProps) => {
    const serverInfo: ServerInfo =  useContext<ServerInfo>(ServerInfoContext);

    const loginToServer = (username: string, password:string):void => { 

    }

    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

     const loginButtonPress = (e:GestureResponderEvent) => {

         //TEMP
         props.setLoginInfo({
             loggedIn: true,
             displayName: "shahaenda",
             username:"shahanneda",
             email: "e@example.com",
             sessionID:"123temp123",
         });
         props.onClose();

     } 

    return (
        <Overlay isVisible={true} onBackdropPress={props.onClose}>
            <View style={styles.container}>
                <Text h1 h1Style={{
                    marginBottom: 20,
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                }}>
                    Login
            </Text>
                <Input
                errorMessage={'invalid password'}
                    
                    placeholder='username'
                />
                <Input
                    placeholder='password'
                    textContentType='password'
                    secureTextEntry={true}
                />
                <Button title='Login'
                    buttonStyle={{
                        width: "100%",
                        paddingHorizontal: 100,
                    }}
                    onPress={loginButtonPress}
                />
            </View >
        </Overlay>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: RColors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 500,
        paddingVertical: 100,
    },
})

interface LoginInfo {
    loggedIn: boolean,
    sessionID?: string,
    username?: string,
    displayName?: string,
    email?: string,
}
export type { LoginInfo };