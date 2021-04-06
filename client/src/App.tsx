import { react } from '@babel/types';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Router, Switch, Route, Link } from "./Router/index";

import Login, { LoginInfo } from './Login';
import HomePage from './HomePage';
import { Button, Text, Header, ThemeProvider, colors } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ServerInfoContext } from './ServerInfo';
import { Redirect } from 'react-router';


// @ts-ignore
import cookie from 'cross-cookie';
import UserDisplay from './UserDisplay';

const styles = StyleSheet.create({


});

const theme = {
  colors: {
    secondary: "#FF9F1C",
    danger: "red",
  },
};


const App: React.FC = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({ loggedIn: false });

  const setLoginInfoAndCookie = (info: LoginInfo) => {
    if(info.loggedIn){
      cookie.set('loginInfo', info);
    }else{
      cookie.remove("loginInfo")
    }

    setLoginInfo(info);
  };

  useEffect(() => {

    cookie.get('loginInfo')
    .then( (val: string)  => JSON.parse(val))
    .then((val: LoginInfo) => {
      console.log(val);
      if(val){
        setLoginInfo(val as LoginInfo)
      }else{
        setLoginInfo({ loggedIn: false })
      }
    });

  }, []);

  return (
    <View >
      <SafeAreaProvider>
        {/* <ServerInfoContext.Provider value={ {apiURL: "https://u2wci1la6h.execute-api.us-west-2.amazonaws.com/prod/api"} }> */}
        <ServerInfoContext.Provider value={ {apiURL: "http://127.0.0.1:5000/api"} }>
          <ThemeProvider theme={theme}>

            <Router>
              {/* <View style={styles.header}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </View> */}

              <Route  path="/home">
                <HomePage setLoginInfo={setLoginInfoAndCookie} loginInfo={loginInfo} />
              </Route>
              <Route  path="/user/:id" component={UserDisplay} />

              <Route path="/">
                <Redirect to="/home" />
              </Route>

              {/* <Route path="/login" component={Login} /> */}
            </Router>
          </ThemeProvider>
        </ServerInfoContext.Provider>
      </SafeAreaProvider>
    </View >
  );
}





export default App;
