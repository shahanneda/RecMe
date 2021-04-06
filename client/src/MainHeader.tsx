import React, { ReactElement, useContext, useState } from 'react'

import { ThemeProvider, Button, Header, Text, withTheme, useTheme } from 'react-native-elements'
import theme from 'react-native-elements/dist/config/theme';
import { useHistory } from 'react-router';
import { LoginInfo } from './Login'
import { ServerInfo, ServerInfoContext } from './ServerInfo';
import { logoutToServer } from './ServerRequests';
interface Props {
    loginInfo: LoginInfo,
    setLoginInfo: (info: LoginInfo) => void,
    
}

export default function MainHeader(props: Props): ReactElement {
    const { theme } = useTheme();
    const [loginShowing, setLoginShowing] = useState(false);
    const history = useHistory();
    const serverInfo: ServerInfo =  useContext<ServerInfo>(ServerInfoContext);

    return (
        <div>
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
            
        </div>
    )
}
