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
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchableDropdown from "react-native-searchable-dropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { decode } from "html-entities";
import Ionicons1 from "react-native-vector-icons/Ionicons";

// import { store } from "../../../redux/store";
// import { Provider } from "react-redux";
// import { setUser } from "../../../redux/features/authSlice";
// import { Link, router } from "expo-router";

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

  // useEffect(() => {
  //   if (user1?.token) {
  //     router.replace('/app/home/home') // Navigate to Login screen if user is falsy

  //   } else if(user1?.code===300) {
  //     router.replace('/auth/Login') // Navigate to Login screen if user is falsy
  //   }else {
  //     router.replace('/auth/Login') // Navigate to Login screen if user is falsy

  //   }
  // }, [user1]);
  // const { user } = useSelector((state) => state.auth);
  // console.log("user", user?.token);
  // console.log('====================================');
  // console.log(user?.token);
  // console.log('====================================');

  const [forums, setForums] = useState([]);

  const [loading, setLoading] = useState(true);

  // const discussionsArray = forums.map((forum) => forum.discussions);
  const { user } = useSelector((state) => state.auth);
  console.log("====================================");
  console.log("forums", forums);
  console.log("====================================");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = "fee8da004fbcbd14ddbc18bad38089e3c00ff082";

      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `https://dev.shiriki.org/api/get-surveys/`,
        config
      );
      const forumsData = res.data.forums;
      const forumsArray = [forumsData];
      console.log("forumsArray");

      setForums(res.data.surveys);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };
  const [discussions, setDiscussions] = useState([]);

  // Function to filter discussions based on forums

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ padding: 15 }}>
        <Text
          style={{
            color: "green",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Surveys
        </Text>
        <Text
          style={{
            width: "100%",
            letterSpacing: 0.45,
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
                    navigation.navigate("SingleSurvey", {
                      id: forum.survey_id,
                      token: user.token,
                      data: forums,
                    })
                  }
                  style={styles.card}
                  className="border p-4 border-slate-200"
                >
                 <View className="flex flex-row  items-center">
                 <Ionicons1
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                      name="person-circle"
                      size={37}
                      color="grey"
                    />
                 <View className="flex flex-col ">
                  <Text
                    className="text-green-600"
                    style={{ fontSize: 15, fontStyle: "" }}
                  >
                    {" "}
                    {forum.institution}
                  </Text>
                  <Text
                    className="text-slate-600 ml-2 italic"
                    style={{ fontSize: 12,  fontStyle: "" }}
                  >
                    {" "}
                    Start Date: {new Date(forum.end_date).toLocaleDateString()}
                  </Text>
                  </View>
                 </View>

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
                      className="capitalize italic  text-slate-900"
                      style={{
                        fontSize: 13,
                        // fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {/* {forum.survey_id} */}
                      {decode(forum.name.replace(/<[^>]+>/g, ""))}
                    </Text>
                    <Text>{forum.category}</Text>
                   
                  </View>
                  <Text
                    style={{
                      letterSpacing: 0.41,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      textAlign: "justify",
                      marginTop: 4,
                      marginBottom: 10,
                      fontFamily: "Helvetica Neue",
                      lineHeight: 20, 
                    }}
                  >
                    {decode(
                      forum.description.replace(/<[^>]+>/g, "").slice(0, 140)
                    )}...
                    <Text className="text-slate-600 italic  ">Read more</Text>
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
    // height: 160,
    borderRadius: 6,
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
