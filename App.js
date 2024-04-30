import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons1 from "react-native-vector-icons/MaterialIcons";
import icons1 from "react-native-vector-icons/Foundation"
import ToastManager, { Toast } from 'toastify-react-native'
import { Provider } from "react-redux";
// Screens
import HomeScreen from "./pages/Home";
import Login from "./pages/auth/Login";
import Polls from "./pages/Polls/Polls";
import Forums from "./pages/forums/Forums";
import Register from "./pages/auth/Register";
import SingleForum from "./pages/forums/SingleForum";
import Alerts from "./pages/Alerts/Alerts";
import {  store } from './redux/store';
import { ToastProvider } from "react-native-toast-notifications";
import Header from "./components/Header";
import SingleSurvey from "./pages/Polls/SingleSurvey";
import SingleAlert from "./pages/Alerts/SingleAlert";
import Reports from "./pages/report/Reports";
import Social1 from "./pages/social/Social";
import Profile from "./pages/auth/Profile";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Screen names
const homeScreen = "Home";
const forumScreen = "Forums";
const pollsScreen = "Surveys";
const AlertScreen = "Alert";
const LoginPage = "Account";
const ReportsPage = "Reports";
const Social = "Social";

function MainContainer() {
  return (
    <ToastProvider>

    <Provider store={store}>
    <NavigationContainer>
          <ToastManager />

      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleForum"
          component={SingleForum}
          // options={({ navigation, route }) => ({
          //   headerTitle: (props) => <Header {...props} />,
          // })}
          options={{ headerShown: true,title:"Forum Activites" }}

        />
         <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleSurvey"
          component={SingleSurvey}
          // options={({ navigation, route }) => ({
          //   headerTitle: (props) => <Header {...props} />,
          // })}
        />
         <Stack.Screen
          name="Header"
          component={Header}
          // options={({ navigation, route }) => ({
          //   headerTitle: (props) => <Header {...props} />,
          // })}
        />
         <Stack.Screen
          name="SingleAlert"
          component={SingleAlert}
          // options={({ navigation, route }) => ({
          //   headerTitle: (props) => <Header {...props} />,
          // })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    </ToastProvider>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={homeScreen}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "grey",
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { paddingTop: 10, height: 80, backgroundColor: "black" },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === homeScreen) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === forumScreen) {
            iconName = focused ? "forum" : "forum";
          } else if (route.name === Social) {
            iconName = focused ? "account-network" : "account-network";
          } 
          else if (route.name === pollsScreen) {
            iconName = focused ? "poll" : "poll";
          } else if (route.name === AlertScreen) {
            iconName = focused ? "newspaper-check" : "newspaper-check";
          }else if (route.name === LoginPage) {
            iconName = focused ? "account" : "account";
          }else if (route.name === ReportsPage) {
            iconName = focused ? "alert-box" : "alert-box";
          }

          // Return icon
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={{ marginBottom: 5,marginTop:1, }}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name={homeScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <Header {...props} />,
        })}
      
        component={HomeScreen}
      />
      <Tab.Screen
        name={forumScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <Header {...props} />,
        })}
        component={Forums}
      />
      
      <Tab.Screen
        name={pollsScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <Header {...props} />,
        })}
        component={Polls}
      />
      <Tab.Screen
        name={Social}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <Header {...props} />,
        })}
        component={Social1}
      />
      <Tab.Screen
        name={AlertScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <Header {...props} />,
        })}
        component={Alerts}
      />
      <Tab.Screen
        name={ReportsPage}
        // options={({ navigation, route }) => ({
        //   headerTitle: (props) => <Header {...props} />,
        // })}
        component={Reports}
      />
        <Tab.Screen
        name={LoginPage}
        
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export default MainContainer;
