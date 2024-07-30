import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, FontAwesome, Entypo } from "@expo/vector-icons";
import feed from "./feeds";
import FeedCard from "./socialCard";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import axios from "axios";
import Ionicons from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocialForm from "./SocialForm";

const data = [
  { key: "Latest", title: "News" },
  { key: "Trending", title: "Trending" },
  { key: "Technology", title: "Technology" },
  { key: "Social Media", title: "Social Media" },
  { key: "Jobs", title: "Jobs" },
  { key: "Society", title: "Society" },
];

export default function Feed({navigation,route}) {
  const [selectedButton, setSelectedButton] = useState("Latest");
  const dispatch = useDispatch();
  const [user1, setUser1] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const users = await AsyncStorage.getItem("profile");
        if (users) {
          const parsedUser = JSON.parse(users);
          dispatch(setUser(parsedUser));
          setUser1(parsedUser);
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
      }
    };

    getUserFromStorage();
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(`https://dev.shiriki.org/api/get-posts/`, config);
      const forumsData = res.data.list;
      // console.log('forumsData',forumsData);
      setForums(forumsData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      className="border border-slate-200"
      style={{
        padding: 6,
        backgroundColor: selectedButton === item.key ? "rgba(0, 128, 0, 0.2)" : "white",
        margin: 5,
        borderRadius: 17,
      }}
      onPress={() => setSelectedButton(item.key)}
    >
      <Text style={{ color: selectedButton === item.key ? "green" : "black" }}>
        {item.title}
      </Text>
    </Pressable>
  );

  // const handleShow = () => {
  //   setShowForm(!showForm);
  // };

  return (
    loading ? <Text>loading...</Text> : (
      <View className="mb-10 bg-white" style={styles.container}>
        <View className="flex p-1 justify-end items-end float-right">
          <Ionicons onPress={() =>navigation.navigate('SocialFormNew')} name="pluscircle" size={24} />
          {/* <TouchableOpacity onPress={navigation.navigate("SocialFormNew")}>
            <Text></Text>
          </TouchableOpacity> */}
        </View> 
          <>
            <View className="p-3">
              <FlatList
                data={data}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={(item) => item.key}
              />
            </View>
            
            <FlatList
              data={forums}
              renderItem={({ item }) => <FeedCard  route={route} navigation={navigation} />}
            />
          </>
      </View>
    )
  );
  
}

const styles = StyleSheet.create({
  // container: { marginTop: 30 },
  iconsRow: { flexDirection: "row" },
  iconCard: { flex: 1, alignItems: "center", paddingBottom: 15 },
  coloredBorder: { borderBottomWidth: 2, borderBottomColor: "#f87171" },
});