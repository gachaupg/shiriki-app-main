import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/AntDesign";
import Ionicons2 from "react-native-vector-icons/Feather";
import { useToast } from "react-native-toast-notifications";

const Sidebar = (navigation) => {
  const dispatch =useDispatch();

  const toast = useToast()
  const { user } = useSelector((state) => state.auth);
  console.log("====================================");
  console.log(user);
  console.log("====================================");
  return (
    <View className="flex mt-6 ">
      <Ionicons size={30} name="arrowleft"/>
      <View className="flex items-center mt-20 justify-center">
        <Text>
          <Ionicons1
            style={{
              display: "flex",
              flexDirection: "row",
            }}
            name="person-circle"
            size={154}
            color="grey"
          />
        </Text>
        <View className="flex flex-row gap-1">
          <Text className="capitalize font- font-bold text-lg">{user?.user?.first_name}</Text>
          <Text className="capitalize  font-bold text-lg">{user?.user?.last_name}</Text>
        </View>
      </View>

      <View className="mt-5 ml-5 gap-4 w-full">
        <View style={{marginLeft:10}} className='flex w-64  p-1 rounded-lg border-slate-200 border mr-40 flex-row items-center '>
          <Ionicons3 name="account" size={37}/>
          <Text>Accounts</Text>
        </View>
        <View className='flex w-64 rounded-lg p-2 border-slate-200 border  mr-40 flex-row items-center '>
          <Ionicons2 onPress={() => {
               
                navigation.navigate('Settings')
                toast.show("Logged out!", { position: "top-left" });

              }}name="settings" size={30}/>
          <Text className="ml-2">Settings</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {
                dispatch(setLogout(null));
                navigation.navigate('Login')
                toast.show("Logged out!", { position: "top-left" });

              }} className="mt-72 ml-3">
        <Ionicons3  name="logout" size={30}/>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({});
