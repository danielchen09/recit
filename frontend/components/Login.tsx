import React, { useState } from 'react';
import { Layout, Button, Input } from '@ui-kitten/components';
import { Alert, StyleSheet, Text } from 'react-native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); //
const LoginComp = ({ navigation, route }) => {
  const [name, setName] = useState("")
  return (
    <Layout style={styles.container}>
      <Layout style={styles.content}>
        <Text style={styles.title}>
          Enter Your Name:
        </Text>
        <Input 
          style={styles.input} 
          textStyle={{
            fontSize: 20,
            color: "#3473AA", 
          }}
          defaultValue={""}
          onChangeText={(v) => setName(v)}
        />
      </Layout>
      {
      route?.params?.receiptId ? 
        <Button 
        onPress={ () => {
          navigation.navigate('Dashboard', {
            username: name.toLowerCase().trim(),
            receiptId: route?.params?.receiptId
          })
        }}
        style={styles.loginButton}>
          Login
        </Button>
        :
        <Button 
        onPress={ () => {
          navigation.navigate('Camera', {
            username: name,
          })
        }}
        style={styles.loginButton}>
          Take Photo
        </Button>
      }
    </Layout>
  )
};

export default LoginComp;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'column',
    margin: 20
  },
  loginButton: {
    backgroundColor: "#3473AA",
    borderColor: "transparent",
    borderRadius: 100,
    width: 300,
  },
  title: {
    color: "#3473AA",
    fontSize: 20,
    alignSelf: 'flex-start'
  },
  input: {
    borderColor: "transparent",
    backgroundColor: "#fff",
    borderBottomColor: "#3473AA",
    marginBottom: 40,
    marginTop: 25,
    width: '70%',
    alignSelf: 'flex-start'
  }
});