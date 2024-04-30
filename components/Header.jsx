import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setLogout } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";

const Header = ({ navigation }) => {
  const dispatch=useDispatch();
  const toast = useToast();
  const handleLogout = () => {
    dispatch(setLogout(null));
    toast.show({
      text1: "Logged out successfully", // Message to show in the toast
      type: 'success', // Type of the toast message
    });
  };
  return (
    <View style={{marginTop:10}}>
      <View style={styles.homeTab}>
        <Ionicons name="menu" size={30} color="red" />
        <TextInput style={styles.input} placeholder="search..." />
        <TouchableOpacity
        style={{backgroundColor:'green',padding:4,color:"white", borderRadius:3}}
        className="bg-green-500"
         onPress={() => {
          dispatch(setLogout(null));
          toast.show('Logged out!', { position: 'top-left' });
         
        }}
  // onPress={() =>
  //   dispatch(setLogout(null))
  //   toast.show("Logined Successfully")

  // }
 
>
  <Text style={{color:'white'}}>Logout</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  homeTab: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    position: "fixed",
    
  },
  input: {
    width: "70%",
    height: 35,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  main: {
    paddingTop: 25,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  profile: {
    height: 40,
    width: 40,
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
