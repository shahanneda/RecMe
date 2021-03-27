import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Button, Header, Text, withTheme, useTheme } from 'react-native-elements'
import { useHistory } from 'react-router';
import Login, { LoginInfo } from './Login';
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
            <Header containerStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

            }}
            rightContainerStyle={{
                justifyContent:"center",
            }}
            >
                <></>

                
                <Text h1 h1Style={{
                    color: "white",
                    fontStyle: "italic",
                }}>
                    RecMe
                </Text>
{!props.loginInfo.loggedIn ?
                    <Button
                        buttonStyle={{
                            backgroundColor: theme?.colors?.secondary,
                            justifyContent: 'center',
                            borderRadius: 1,
                        }}
                        title="Join"
                        type="solid"
                        onPress={() => {
                            history.push("/home/ls/join")
                            // setLoginShowing(true)
                        }}
                    /> :
                    <Button
                        title="Log Out"
                        onPress={() => {
                            logoutToServer({
                                serverInfo:serverInfo,
                                loginInfo: props.loginInfo,
                            })
                            props.setLoginInfo({ loggedIn: false })
                        }}
                        buttonStyle={{
                            backgroundColor: "red",
                            justifyContent: 'center',
                            borderRadius: 1,
                        }}
                    />}
            </Header>



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
