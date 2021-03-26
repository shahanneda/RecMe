import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Button, Header, Text, withTheme, useTheme } from 'react-native-elements'
import Login, { LoginInfo } from './Login';

interface HomeProps {
    setLoginInfo: (info: LoginInfo) => void,
    loginInfo: LoginInfo,
}

const HomePage = (props: HomeProps) => {
    const { theme } = useTheme();
    const [loginShowing, setLoginShowing] = useState(false);
    return (
        <View>
            <Header containerStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <View>
                    {!props.loginInfo.loggedIn ? <Button
                        buttonStyle={{
                            backgroundColor: theme?.colors?.secondary,
                            justifyContent: 'center',
                            borderRadius: 1,
                        }}
                        title="Join"
                        type="solid"
                        onPress={() => {
                            setLoginShowing(true)
                        }}
                    /> : <Button title="Log Out" onPress={() => {
                        props.setLoginInfo({ loggedIn: false })
                    }} />}
                </View>

                <Text h1 h1Style={{
                    color: "white",
                    fontStyle: "italic",
                }}>
                    RecMe
                </Text>
            </Header>



            {loginShowing ? <Login onClose={() => { setLoginShowing(false) }} setLoginInfo={props.setLoginInfo} /> : null}

            {props.loginInfo.loggedIn ?<View>
            <Text>
                Welcome {props.loginInfo.username}
                Logged in!
                sessionID: {props.loginInfo.sessionID}
            </Text> 
            </View>: null
            }

        </View>
    )
}

export default HomePage;

const styles = StyleSheet.create({})
