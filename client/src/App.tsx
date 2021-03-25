import { react } from '@babel/types';
import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NativeRouter, Route, Link } from "react-router-native";




interface Styles {
  container: ViewStyle,
  loginButton: ViewStyle,
  logo: TextStyle,
  header: TextStyle,
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: 'blue',
    width: "100%",
    height: "100%",
  },
  loginButton: {
  },
  logo: {

  },
  header: {

  }
});

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <NativeRouter>

        <View>
          <Link to="/" underlayColor="#f0f4f7" >
            <Text>Home</Text>
          </Link>
        </View>

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </NativeRouter>
    </View >
  );
}


const Home = () => <Text style={styles.header}>Home</Text>;

const About = () => <Text style={styles.header}>About</Text>;


export default App;
