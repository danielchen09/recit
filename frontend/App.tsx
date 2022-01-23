import { StyleSheet, Text } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from "react-native-svg"
import React, { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Button, IconRegistry } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraComp from './components/Camera';
import LoginComp from './components/Login';
import DashboardComp from './components/Dashboard';
import BalanceComp from './components/Balance';
import { initializeApp } from 'firebase/app';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Linking from 'expo-linking';

const HomeScreen = (props) => (
  <Layout style={styles.container}>
    <Svg
      width={365}
      height={205}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M91.579 174v-49.536h22.752c3.12 0 5.592.384 7.416 1.152 1.872.72 3.24 1.776 4.104 3.168.912 1.344 1.512 2.928 1.8 4.752a37.41 37.41 0 0 1 .432 5.832c0 1.776-.168 3.624-.504 5.544a11.683 11.683 0 0 1-2.088 5.112c-1.056 1.536-2.736 2.664-5.04 3.384L128.803 174h-6.624l-8.208-20.808 1.728.864a7.09 7.09 0 0 1-1.224.216 20.55 20.55 0 0 1-1.944.072h-14.76V174h-6.192Zm6.192-25.056h13.896c2.4 0 4.272-.192 5.616-.576 1.392-.384 2.4-.984 3.024-1.8.672-.816 1.104-1.8 1.296-2.952.192-1.2.288-2.616.288-4.248 0-1.632-.096-3.024-.288-4.176-.144-1.2-.528-2.184-1.152-2.952-.576-.816-1.536-1.416-2.88-1.8-1.296-.432-3.096-.648-5.4-.648h-14.4v19.152ZM140.587 174v-49.536h32.184v5.328h-25.992v16.488h22.608v5.4h-22.608v16.992h25.992V174h-32.184Zm61.599.576c-3.456 0-6.36-.192-8.712-.576-2.352-.432-4.272-1.152-5.76-2.16-1.488-1.056-2.64-2.52-3.456-4.392-.768-1.92-1.296-4.368-1.584-7.344-.288-2.976-.432-6.6-.432-10.872s.144-7.872.432-10.8c.288-2.976.816-5.4 1.584-7.272.816-1.92 1.968-3.408 3.456-4.464 1.488-1.056 3.408-1.776 5.76-2.16 2.352-.432 5.256-.648 8.712-.648 1.344 0 2.712.048 4.104.144 1.44.096 2.808.216 4.104.36 1.296.144 2.424.336 3.384.576v4.968a69.748 69.748 0 0 0-3.456-.36 41.923 41.923 0 0 0-3.456-.288 75.135 75.135 0 0 0-3.096-.072c-2.784 0-5.112.12-6.984.36-1.872.24-3.36.72-4.464 1.44-1.104.672-1.944 1.752-2.52 3.24-.528 1.44-.888 3.384-1.08 5.832-.192 2.4-.288 5.448-.288 9.144 0 3.696.096 6.768.288 9.216.192 2.4.552 4.344 1.08 5.832.576 1.44 1.416 2.52 2.52 3.24 1.104.672 2.592 1.128 4.464 1.368 1.872.24 4.2.36 6.984.36a71.59 71.59 0 0 0 5.328-.216 81.772 81.772 0 0 0 4.968-.504v5.112c-1.008.192-2.208.336-3.6.432a104.43 104.43 0 0 1-4.176.36c-1.44.096-2.808.144-4.104.144Zm23.198-.576v-49.536h6.192V174h-6.192Zm31.185 0v-44.064h-15.624v-5.472h37.512v5.472h-15.696V174h-6.192Z"
        fill="#3473AA"
      />
      <Rect
        x={109.5}
        y={2.5}
        width={145}
        height={175}
        rx={7.5}
        stroke="url(#a)"
        strokeWidth={5}
      />
      <Path
        stroke="#3473AA"
        strokeWidth={5}
        d="M119 22.5h107M119 81.5h107M119 44.5h75M119 63.5h60"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={182}
          y1={0}
          x2={182}
          y2={180}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3473AA" />
          <Stop offset={0.646} stopColor="#3473AA" />
          <Stop offset={0.646} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
    <Button onPress={() => props.navigation.navigate('Login')} style={styles.loginButton}>
      Start
    </Button>
  </Layout>
);

const Stack = createNativeStackNavigator();
export default function App() {
  // Initialize Firebase
  const firebaseConfig = {

  };

  initializeApp(firebaseConfig);
  const linking = {
    prefixes: ["exp://28-rrp.alwinyen.recit.exp.direct/--/"],
    config: {
      screens: {
        Home: 'home',
        Camera: 'camera',
        Login: {
          path: 'login/:receiptId',
          parse: {
            receiptId: receiptId => receiptId
          }
      },
        Dashboard: 'dashboard',
        Balance: 'balance'
      },
    }
  };
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Camera" component={CameraComp} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginComp} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardComp} options={{ headerShown: false }} />
          <Stack.Screen name="Balance" component={BalanceComp} options={{ headerShown: false }} />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#3473AA",
    borderColor: "transparent",
    borderRadius: 100,
    width: 300
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
