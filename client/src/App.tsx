import { react } from '@babel/types';
import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import { NativeRouter, Route, Link } from "react-router-native";
import {Router, Switch, Route, Link} from "./Router/index";

import Login from './Login';




interface Styles {
  container: ViewStyle,
  loginButton: ViewStyle,
  logo: TextStyle,
  header: TextStyle,
  buttonOutside: ViewStyle,
  buttonInside: TextStyle,
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: '#e0fffe',
    width: "100vw",
    height: "100vh",
  },
  loginButton: {
    padding: "5px",
    width:"50%",
    backgroundColor:"#ebf8ff",
    borderWidth:1,
    borderStyle:"solid",
    borderColor:"cyan",
    flex:1,
  },
  logo: {

  },
  header: {
    display: "flex",
    flexDirection:"row",
    padding: "10px",
    backgroundColor: "#8fdaff",
    width: "100%",
    height: "10%",
    top: "0",
    left: "0",
  },
  buttonOutside:{


  },

  buttonInside:{
    textAlign:"center",
    margin:"auto",
  }

});

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Router>

        {/* <View style={styles.header}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </View> */}


        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
      </Router>
    </View >
  );
}


const Home = () => <Text style={styles.logo}>Home</Text>;



export default App;
