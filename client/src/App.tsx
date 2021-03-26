import { react } from '@babel/types';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Router, Switch, Route, Link } from "./Router/index";

import Login, { LoginInfo } from './Login';
import HomePage from './HomePage';
import { Button, Text, Header, ThemeProvider, colors } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';



const styles = StyleSheet.create({


});

const theme = {
  colors: {
    secondary: "#FF9F1C",
    danger: "red",
  },
};


const App: React.FC = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({loggedIn: false});

  useEffect(() => {
    setLoginInfo({ loggedIn: false })
  }, []);

  return (
    <View >
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>

          <Router>
            {/* <View style={styles.header}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </View> */}

            <Route exact path="/">
              <HomePage setLoginInfo={setLoginInfo} loginInfo={loginInfo}/>
            </Route>

            {/* <Route path="/login" component={Login} /> */}
          </Router>
        </ThemeProvider>
      </SafeAreaProvider>
    </View >
  );
}





export default App;
