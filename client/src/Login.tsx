
import React, { useContext, useState } from 'react'
import { GestureResponderEvent, StatusBar, StyleSheet, View } from 'react-native'
import { RColors } from './RColors'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Button, Input, Text } from 'react-native-elements';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import { ServerInfo, ServerInfoContext } from './ServerInfo';
import { loginToServer } from './ServerRequests';
import { Route } from "./Router"
import { useHistory } from 'react-router';


interface LoginProps {
    onClose: () => void,
    setLoginInfo: (info: LoginInfo) => void,
}



const Login: React.FC<LoginProps> = (props: LoginProps) => {

    const history = useHistory();
    return (
        <Overlay isVisible={true} onBackdropPress={props.onClose}>


            <Route path="/home/ls/join">

                <View style={styles.container}>
                    <View>
                        <Button title='Login'
                            buttonStyle={{
                                width: "100%",
                                paddingHorizontal: 80,
                                marginTop: 10,
                            }}
                            onPress={() => { history.push("/home/ls/login") }}
                        />
                        <Button title='Create Account'
                            buttonStyle={{
                                width: "100%",
                                paddingHorizontal: 80,
                                marginTop: 10,
                                backgroundColor: RColors.dark,
                            }}
                            onPress={() => { history.push("/home/ls/create-account") }}
                        />
                    </View>
                </View>
            </Route>

            <Route path="/home/ls/login">
                <FormPage onClose={props.onClose} setLoginInfo={props.setLoginInfo} />

            </Route>


        </Overlay>
    )
}

export default Login

interface FormPageProps {
    onClose: () => void,
    setLoginInfo: (info: LoginInfo) => void,

}
const FormPage: React.FC<FormPageProps> = (props: FormPageProps) => {

    const serverInfo: ServerInfo = useContext<ServerInfo>(ServerInfoContext);
    const [shouldShowUsernameError, setShouldShowUsernameError] = useState<Boolean>(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<Boolean>(false);

    const history = useHistory();

    const loginButtonPress = (e: GestureResponderEvent) => {
        loginToServer({
            onClose: props.onClose,
            username: username,
            password: password,
            serverInfo: serverInfo,
            setLoading: setLoading,
            setLoginInfo: props.setLoginInfo,
            setShouldShowUsernameError: setShouldShowUsernameError,
        })
    }


    return (<View style={styles.container}>

        <Button title='Back'
            buttonStyle={{
                width: "100%",
                paddingHorizontal: 80,
                marginTop: 10,
                backgroundColor: RColors.dark,
            }}
            onPress={() => { history.push("/home/ls/join") }}
        />
        {loading ? <Text>Loading</Text> : null}
        <Text h1 h1Style={{
            marginBottom: 20,
            borderBottomColor: "black",
            borderBottomWidth: 1,
        }}>
            Login
            </Text>
        <Input
            errorMessage={shouldShowUsernameError ? "Invalid username or password" : undefined}
            placeholder='username'
            value={username}
            onChangeText={setUsername}
        />
        <Input
            placeholder='password'
            textContentType='password'
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
        />
        <View>
            <Button title='Login'
                buttonStyle={{
                    width: "100%",
                    paddingHorizontal: 100,
                }}
                onPress={loginButtonPress}
            />

        </View>
    </View >)
}
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