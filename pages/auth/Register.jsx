import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";

import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/features/authSlice";
import { useToast } from "react-native-toast-notifications";
import PhoneInput from "react-phone-number-input/react-native-input";
import PhoneNumber from "libphonenumber-js";
const initialState = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  confirmpassword: "",
};

const Register = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  console.log(form);
  const handleSubmit = () => {
    if (form.first_name && form.email && form.password) {
      dispatch(register({ user: form, navigate: navigation.navigate, toast }));
    } else {
      // Handle form validation errors here
      toast.show("Please fill in all the fields");
    }
  };
  const [value, setValue] = useState();
  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "green", // Green border color
      borderRadius: 15, // Border radius of 15
      color: "black", // Text color
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "green", // Green border color
      borderRadius: 15, // Border radius of 15
      color: "black", // Text color
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  };
  const selectedItem = {
    title: "Choose your gender",
  };
  return (
    <View style={styles.login}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://shiriki.org/static/logo.png" }}
          style={styles.logo}
        />
      </View>

      <View>
        <Text style={styles.title1}>USIKIKE!</Text>
        <Text style={styles.p}>Transfering Governance with your input</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="first name"
            keyboardType="text"
            onChangeText={(text) => setForm({ ...form, first_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="last name"
            keyboardType="text"
            onChangeText={(text) => setForm({ ...form, last_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="email"
            keyboardType="email-address"
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="phone"
            keyboardType="number"
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="location"
            keyboardType="text"
            onChangeText={(text) => setForm({ ...form, location: text })}
          />
          <RNPickerSelect
            pickerProps={{
              accessibilityLabel: selectedItem.title,
            }}
            style={pickerSelectStyles}
            onValueChange={(value) => console.log(value)}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            keyboardType="password"
            secureTextEntry={true}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="confirm password"
            keyboardType="password"
            secureTextEntry={true}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Submitting" : "Register"}
              color="green"
              onPress={handleSubmit}
            />
          </View>
          {/* <Text>OR</Text> */}
          {/* <View className="w-72 rounded-sm flex items-center justify-center bg-red-400 p-2 text-white">
            <Text className="text-white"> Continue with Google</Text>
          </View> */}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          marginTop: 7,
        }}
      >
        <Text> If you have an account?</Text>
        <Text
          onPress={() => navigation.navigate("Account")}
          style={{ color: "red", fontSize: 25 }}
        >
          Login to your account
        </Text>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  login: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
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
    textAlign: "center",
  },
  title1: {
    fontSize: 65,
    color: "red",
    fontWeight: "800",
    textAlign: "center",
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
    borderRadius: 6,
    width: "80%",
    marginTop: 15,
  },
});
