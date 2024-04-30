import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const Profile = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState(user?.user?.first_name);
  const [lastName, setLastName] = useState(user?.user?.last_name);
  const [email, setEmail] = useState(user?.user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.user?.phone_number);

  const handleUpdate = () => {
    // Handle update logic here
  };
  useEffect(() => {
    if (user) {
      navigation.navigate("Home"); // Navigate to Home screen if user is truthy
    } else {
      navigation.navigate("Login"); // Navigate to Login screen if user is falsy
    }
  }, [user]);

  return (
    <View className="pr-5 pl-5 pb-5">
      <View
        style={{ width: 370,marginTop: 14, }}
        className="flex flex-col p-3 mt-40  shadow-2xl shadow-black justify-between bg-white gap-2 border-green-700 rounded-lg border-1 border"
       >
        <Text className="text-red-500 text-xl">Account Details</Text>
        <View className="flex flex-row justify-between items-end gap-2 capitalize ">
          <Text>Name:</Text>
          <Text className="flex flex-row gap-2 capitalize text-green-700">
            {user.user.first_name} {user.user.last_name}
          </Text>
        </View>
        <View className="flex flex-row justify-between items-end gap-2 capitalize ">
          <Text>Email:</Text>
          <Text className="flex flex-row gap-2  text-green-700">
            {user.user.email}
          </Text>
        </View>
        <View className="flex flex-row gap-2 justify-between  capitalize ">
          <Text >Phone Number:</Text>
          <Text className="flex flex-row gap-2 capitalize text-green-700">
            {user.user.phone_number}
          </Text>
        </View>
        <View className="flex flex-row gap-2 justify-between  capitalize ">
          <Text >Location:</Text>
          <Text className="flex flex-row gap-2 capitalize text-green-700">
            Nairobi
          </Text>
        </View>
        <View className="flex flex-row gap-2 justify-between  capitalize ">
          <Text >Gender:</Text>
          <Text className="flex flex-row gap-2 capitalize text-green-700">
            Male
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 10 ,width:370 }} className="flex shadow-2xl shadow-black flex-col p-5 justify-center bg-white gap-2 border-green-700 rounded-lg border-1 border">
        <Text className="text-red-500" style={{ fontSize: 18, marginBottom: 10 }}>Update Profile:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          placeholder="Phone Number"
        />
        <TouchableOpacity className="flex text-center items-center bg-green-700 p-2 rounded-lg">
            <Text className="text-white">Update</Text>
        </TouchableOpacity>
        {/* <Button title="Update" onPress={handleUpdate} /> */}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius:5
  },
});
