import React, { useEffect } from "react";
import { StyleSheet, View, Button, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons1 from "react-native-vector-icons/MaterialIcons";
import icons1 from "react-native-vector-icons/Foundation";
import ToastManager, { Toast } from "toastify-react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
// Screens
import HomeScreen from "./pages/Home";
import Login from "./pages/auth/Login";
import Polls from "./pages/Polls/Polls";
import Forums from "./pages/forums/Forums";
import Register from "./pages/auth/Register";
import SingleForum from "./pages/forums/SingleForum";
import Alerts from "./pages/Alerts/Alerts";
import { store } from "./redux/store";
import { ToastProvider } from "react-native-toast-notifications";
import Header from "./components/Header";
import SingleSurvey from "./pages/Polls/SingleSurvey";
import SingleAlert from "./pages/Alerts/SingleAlert";
import Reports from "./pages/report/Reports";
import Social1 from "./pages/social/Social";
import Profile from "./pages/auth/Profile";
import { setUser } from "./redux/features/authSlice";
import Replies from "./pages/forums/Replies";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Sidebar from "./pages/Sidebar";
import Sidebar1 from "./pages/Sidebar";
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import {
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
// import StackNavigator from './src/navigation/StackNavigator';
import DarkMode from './pages/utils/Darkmode';
import {  useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import Settings from "./pages/settings";
import SocialForm from "./pages/social/SocialForm";
import SinglePostPage from "./pages/social/SinglePostPage";
import UpdateSocial from "./pages/auth/update/UpdateSocial";
import UpdateAlerts from "./pages/auth/update/UpdateAlrerts";
import AlertForm from "./pages/Alerts/AlertForm";
import SocialFormNew from "./pages/social/SocialFormNew";
import Reply from "./pages/social/Reply";
// dark mode


// Screen names
const homeScreen = "Home";
const forumScreen = "Forums";
const pollsScreen = "Surveys";
const AlertScreen = "Alert";
const LoginPage = "Account";
const ReportsPage = "Reports";
const Social = "Social";
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Bar Screens

function ScreenTwo() {
  return (
    <View style={styles.container}>
      <Text>Screen Two</Text>
    </View>
  );
}

function OtherScreen() {
  return (
    <View style={styles.container}>
      <Text>Other Screen</Text>
    </View>
  );
}

// Sidebar Content Component
function SidebarContent() {
  return (
    <View style={styles.sidebar}>
      <Text>Sidebar Content</Text>
    </View>
  );
}

// Main App Component
export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useDeviceSettings, setUseDeviceSettings] = useState(false);
  
  // Create custom dark theme
  
  const scheme = useColorScheme(); // this gets the current native appearance of device
  
  const CustomDarkTheme= {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: 'white',
      background: '#202120',
      card: '#121212',
    },
  };
  
  useEffect(() => {
    let subscription;
  
    if (useDeviceSettings) {
      subscription = Appearance.addChangeListener((scheme) => {
        // Is dark mode will be true when scheme.colorScheme is equal to 'dark'
        setIsDarkMode(scheme.colorScheme === 'dark');
      });
    }
  
    // cleanup
    return () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
    };
  }, [scheme, isDarkMode, useDeviceSettings]);
  
  if (!fontsLoaded) {
    return null;
  }
  return (
    <DarkMode.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        useDeviceSettings,
        setUseDeviceSettings,
      }}
    >
    <ToastProvider>
      <Provider store={store}>

        <NavigationContainer style={isDarkMode ? 'light' : 'dark'}>
          <Drawer.Navigator drawerContent={() => <Sidebar1 />}>

            <Drawer.Screen
              name="Home"
              options={{
                headerTitle: (props) => <Header {...props} />,
              }}
              component={TabNavigator}
            />
            <Drawer.Screen
              options={{ headerShown: false }}
              name="Settings"
              component={Settings}
            />
            <Drawer.Screen
              options={{ headerShown: false }}
              name="SingleForum"
              component={SingleForum}
            />
            <Drawer.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Drawer.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Drawer.Screen
              name="Replies"
              component={Reply}
             
              
              options={{ headerShown: false, title: "Replies" }}
            />

            <Drawer.Screen
              name="SingleSurvey"
              component={SingleSurvey}
              options={{ headerShown: false }}

            />
             <Drawer.Screen
              name="SocialForms"
              component={SocialForm}
              options={{ headerShown: false }}

            />
            <Drawer.Screen
              name="Header"
              component={Header}
              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
            
            <Drawer.Screen
              name="SingleAlert"
              component={SingleAlert}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
              <Drawer.Screen
              name="SocialFormNew"
              component={SocialFormNew}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
            <Drawer.Screen
              name="AlertForm"
              component={AlertForm}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
            <Drawer.Screen
              name="SingleSocial"
              component={SinglePostPage}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
              <Drawer.Screen
              name="UpdateSocial"
              component={UpdateSocial}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
            <Drawer.Screen
              name="UpdateAlert"
              component={UpdateAlerts}
              options={{ headerShown: false }}

              // options={({ navigation, route }) => ({
              //   headerTitle: (props) => <Header {...props} />,
              // })}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </Provider>
    </ToastProvider>
    </DarkMode.Provider>
  );
}

// Bottom Tab Navigator
function TabNavigator({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  console.log("====================================");
  console.log("userss", user?.code);
  console.log("====================================");


  return (
    
    <Tab.Navigator>

      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarActiveTintColor: 'red',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Forums"
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="forum" color={color} size={size} /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Forums}
      />
      <Tab.Screen
        name="Surveys"
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="poll" color={color} size={size} /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Polls}
      />
      <Tab.Screen
        name="Social"
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-network"
              color={color}
              size={size}
            /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Social1}
      />

      <Tab.Screen
        name="Alerts"
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="newspaper-check"
              color={color}
              size={size}
            /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Alerts}
      />
      <Tab.Screen
        name="Reports"
        // options={({ navigation, route }) => ({
        //   headerTitle: (props) => <Header {...props} />,
        // })}
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="alert-box"
              color={color}
              size={size}
            /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Reports}
      />
      <Tab.Screen
        name="Account"
        options={{
          tabBarActiveTintColor: 'red',

          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} /> // Use an icon from the @expo/vector-icons package
          ),
        }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
});
