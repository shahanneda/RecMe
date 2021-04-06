import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Button, Header, Text, withTheme, useTheme } from 'react-native-elements'
import { useHistory } from 'react-router';
import Login, { LoginInfo } from './Login';
import MainHeader from './MainHeader';
import { Route } from './Router';
import { ServerInfo, ServerInfoContext } from './ServerInfo';
import { logoutToServer } from './ServerRequests';

interface HomeProps {
    setLoginInfo: (info: LoginInfo) => void,
    loginInfo: LoginInfo,
}


const HomePage = (props: HomeProps) => {
    const { theme } = useTheme();
    const [loginShowing, setLoginShowing] = useState(false);
    const history = useHistory();
    const serverInfo: ServerInfo =  useContext<ServerInfo>(ServerInfoContext);
    return (
        <View>

            <Route path="/home/ls/">
                <Login onClose={() => { history.push("/home")}} setLoginInfo={props.setLoginInfo} /> 
            </Route>

            {props.loginInfo.loggedIn ? <View>
                <Text>
                Welcome {props.loginInfo.userID}
                {"\n"}
                Logged in!
                {"\n"}
                sessionID: {props.loginInfo.sessionID}
                </Text>
            </View> : null
            }

        </View>
    )
}

export default HomePage;

const styles = StyleSheet.create({})
