import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/AntDesign";
import Ionicons2 from "react-native-vector-icons/Feather";
import { useToast } from "react-native-toast-notifications";
import SearchableDropdown from "react-native-searchable-dropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { decode } from "html-entities";
// import { setUser } from "../../../redux/features/authSlice";
// import { Link, router } from "expo-router";
import { setUser } from "../redux/features/authSlice";

const Forums = ({ navigation }) => {
  const [active, setActive] = useState(true);
  const [active1, setActive1] = useState(false);

  const handleChange = () => {
    if (!active) {
      setActive(true);
      setActive1(false);
    }
  };

  const handleChange1 = () => {
    if (!active1) {
      setActive(false);
      setActive1(true);
    }
  };
  const dispatch = useDispatch();
  const [user1, setUser1] = useState(null); // Initialize user1 as null

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

  // console.log('====================================');
  // console.log('useres', user1.token);
  // console.log('====================================');

  const { user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (user) {
  //     router.replace('/app/home/home') // Navigate to Login screen if user is falsy

  //   }else {
  //     router.replace('/app/home/account') // Navigate to Login screen if user is falsy

  //   }
  // }, [user]);
  // console.log("user", user?.token);
  // console.log('====================================');
  // console.log(user?.token);
  // console.log('====================================');

  const [forums, setForums] = useState([]);

  const [loading, setLoading] = useState(true);

  const discussionsArray = forums.map((forum) => forum.discussions);
  // const { user } = useSelector((state) => state.auth);
  console.log("====================================");
  console.log(forums);
  console.log("====================================");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = "fee8da004fbcbd14ddbc18bad38089e3c00ff082";

      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `https://dev.shiriki.org/api/get-forums/`,
        config
      );
      console.log("====================================");
      console.log("forumsArrayssss", res.data);
      console.log("====================================");
      const forumsData = res.data.forums;
      const forumsArray = [forumsData];
      // console.log("forumsArray",forumsArray);

      setForums(forumsArray);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const users = await AsyncStorage.getItem("profile");
        console.log("====================================");
        console.log("users", users);
        console.log("====================================");
        if (users) {
          const parsedUser = JSON.parse(users);
          dispatch(setUser(parsedUser));
        }
        if (users === null) {
          navigation.navigate("Login");
        } else {
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
      }
    };

    getUserFromStorage();
  }, [dispatch]);

  useEffect(() => {}, []);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ padding: 14 }}>
        <Text
          style={{
            color: "green",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Forums
        </Text>
        <Text
          style={{
            width: "100%",
            letterSpacing: 0.4,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            textAlign: "justify",

            fontFamily: "Helvetica Neue",
            lineHeight: 17,
          }}
        >
          Lorem Ipsum is simply dummy text of the printing. Lorem Ipsum is
          simply dummy text of the printing .
        </Text>
        {/* */}
        <View style={styles.forumHeader}>
          <View
            style={{
              backgroundColor: active ? "rgba(0, 128, 0, 0.2)" : "transparent",
              padding: 5.5,
              width: 85,
              paddingRight: 10,
              borderRadius: 50,
            }}
          >
            <TouchableOpacity onPress={handleChange}>
              <Text style={{ color: "green", marginLeft: 17 }}>Active</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: active1 ? "rgba(0, 128, 0, 0.2)" : "transparent",
              padding: 5.5,
              width: 85,
              paddingRight: 10,
              borderRadius: 16,
            }}
          >
            <TouchableOpacity onPress={handleChange1}>
              <Text
                style={{
                  color: active1 ? "rgba(0, 128, 0, 255)" : "black",
                  marginLeft: 20,
                }}
                className="text-white text-center "
              >
                Past
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}></View>
        </View>
        {loading ? (
          <Text>Loading... </Text>
        ) : (
          <View>
            {forums?.map((forum) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("SingleForum", {
                      id: forum.forum_id,
                      token: user.token,
                      data: forums,
                    })
                  }
                  className="border rounded-lg border-slate-200 mt-3 p-2"
                >
                  <View className="flex flex-row items-center">
                    <Ionicons1
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                      name="person-circle"
                      size={37}
                      color="grey"
                    />
                    <View className="flex flex-col">
                      <Text
                        style={{ fontSize: 14, color: "green", fontStyle: "" }}
                      >
                        {" "}
                        {forum.institution}
                      </Text>
                      <Text
                        className="ml-1 text-slate-700 "
                        style={{ fontSize: 12 }}
                      >
                        {" "}
                        Start Date:{" "}
                        {new Date(forum.end_date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* </Link> */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      className="capitalize italic text-slate-800"
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {forum.forum} {forum.forum_id}
                    </Text>
                    <Text>{forum.category}</Text>

                  </View>
                  <Text
                    style={{
                      letterSpacing: 0.3,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      textAlign: "justify",
                      marginTop: 10,
                      // marginBottom: 10,
                      fontFamily: "Helvetica Neue",
                      lineHeight: 20, // Adjust line spacing as needed
                    }}
                  >
                    {decode(
                      forum.description.replace(/<[^>]+>/g, "").slice(0, 243)
                    )}
                    ...
                    <Text className="text-red-700 italic">Read more</Text>
                  </Text>
                  <View className="flex flex-row items-end justify-end">
                    <Text
                  
                      style={{
                        color: "red",
                        fontSize: 11,
                        fontStyle: "italic",
                        
                      }}
                    >
                      {" "}
                      End Date: {new Date(forum.end_date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                </TouchableOpacity>
              );
            })}
            
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Forums;

const styles = StyleSheet.create({
  homeTab: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    position: "fixed",
  },
  forumHeader: {
    height: 38.2,
    width: "100%",
    // borderColor: "grey",
    // borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    padding: 3,
    gap: 20,
    marginTop: 20,
  },
  main: {
    paddingTop: 25,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  profile: {
    padding: 2,
    height: 40,
    width: 40,
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    marginTop: 17,
    width: "100%",
    backgroundColor: "white",
    // height: 170,
    borderRadius: 6,
    padding: 6,
    // Android
    elevation: 5, // Adjust the elevation value for desired shadow effect
    // iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  cardBody: {
    color: "white",
    marginTop: "108%",
  },
  icon: {
    marginLeft: "75%",
  },
  flatList: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 20,
  },
  flatListContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
