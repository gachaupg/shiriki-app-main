import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import Register from "./Register";
import { useDispatch, useSelector } from "react-redux";
import { login, setUser } from "../../redux/features/authSlice";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const initialState = {
   
    username: "",
    password: "",
  };
  const toast = useToast();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  console.log(error);
  const handleSubmit = () => {
    if (form.username && form.password) {
      try {
        dispatch(login({ user: form, navigate: navigation.navigate, toast }));
      } catch (error) {
        console.error('Error occurred during login dispatch:', error);
      }
    } else {
      toast.show("Please fill in all the fields");
    }
  };
  

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const users = await AsyncStorage.getItem("profile");
        console.log('====================================');
        console.log(users);
        console.log('====================================');
        if (users) {
          const parsedUser = JSON.parse(users);
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
      }
    };

    getUserFromStorage();
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
// console.log('====================================');
// console.log('user',user);
// console.log('====================================');
useEffect(() => {
  if (user) {
    navigation.navigate("Home"); // Navigate to Home screen if user is truthy
  } else {
    navigation.navigate("Login"); // Navigate to Login screen if user is falsy
  }
}, [user]); 
  return (
    <View style={styles.login}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://shiriki.org/static/logo.png' }}
          style={styles.logo}
        />
      </View>

      <View>
        <Text style={styles.title1}>USIKIKE!</Text>
        <Text style={styles.p}>Transfering Governance with your input</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            pstyle={styles.input}
            placeholder="email"
            keyboardType="email-address"
            onChangeText={(text) => setForm({ ...form, username: text })}

          />
          <TextInput
            style={styles.input}
            placeholder="password"
            keyboardType="password"
            secureTextEntry={true}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Submitting" : "Login"}
              color="green"
              onPress={handleSubmit}
            />
          </View>
          <Text>OR</Text>
          <View className="w-72 rounded-sm flex items-center justify-center bg-red-400 p-2 text-white">
            <Text className="text-white"> Continue with Google</Text>
          </View>
        </View>
      </View>

      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 7 }}>
        <Text> Don't have an account?</Text>
       
        <Text onPress={() => navigation.navigate('Register')} style={{ color: 'red', fontSize: 25 }}>Create an account</Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  login: {
    flex: 1,
    padding: 12,
    // alignItems:'center',
    justifyContent:'center'
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 110,
  },
  form: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "green",
    fontWeight: "800",
    textAlign: "center",
  },
  p: {
    fontFamily: "Qwitcher Grypen",
    fontWeight: "400",
    fontStyle: "italic",
    textAlign: 'center'
  },
  title1: {
    fontSize: 65,
    color: "red",
    fontWeight: "800",
    textAlign: 'center'
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    color:'white',
    borderRadius: 6,
    width:'80%'
  },
});
