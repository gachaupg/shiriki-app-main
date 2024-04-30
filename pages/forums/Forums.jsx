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
import { api } from "../../utils/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { decode } from "html-entities";

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

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const users = await AsyncStorage.getItem("profile");
        // console.log('====================================');
        // console.log(users);
        // console.log('====================================');
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
  // console.log(user?.token);
  // console.log('====================================');
  useEffect(() => {
    if (user) {
      navigation.navigate("Home"); // Navigate to Home screen if user is truthy
    } else {
      navigation.navigate("Login"); // Navigate to Login screen if user is falsy
    }
  }, [user]);

  const [forums, setForums] = useState([]);
  console.log("====================================");
  console.log("forums", forums);
  console.log("====================================");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = user.token;
        console.log("token", token);
        const config = {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.get(
          `http://137.184.9.57/api/get-forums/`,
          config
        );
        const jsonArray = JSON.stringify(res.data);
        const forumsData = res.data.forums;
        const forumsArray = [forumsData];
        console.log("forumsArray", forumsArray);

        setForums(forumsArray);
        setLoading(false)
      } catch (error) {
        console.log("emm", error);
        setLoading(false)

      }
    }

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={{ marginTop: 10, padding: 10 }}>
        <Text
          style={{
            color: "green",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Forums
        </Text>
        <Text style={{ width: "100%" }}>
          Lorem Ipsum is simply dummy text of the printing .
        </Text>
        {/* */}
        <View style={styles.forumHeader}>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
            <Button
              onPress={handleChange}
              color={active ? "green" : "grey"}
              style={{ borderRadius: 20 }}
              title="Active"
            />
          </View>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
            <Button
              onPress={handleChange1}
              color={active1 ? "green" : "grey"}
              style={{ borderRadius: 20 }}
              title="Past"
            />
          </View>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}></View>
        </View>
        {loading ?(
          <Text>Loading... </Text>
        ):(
          <View>
          {forums?.map((forum) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SingleForum", { id: forum.forum_id ,token:user.token})
                }
                style={styles.card}
              >
                <Text className="capitalize" style={{ color: "red", fontSize: 15, fontWeight: "500" }}>
                  {forum.forum}
                </Text>
                <Text style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "end",
                        flex: 1,
                        width:380
                      }}>
                  {decode(
                    forum.description.replace(/<[^>]+>/g, "").slice(0, 255)
                  )}
                  ...
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text> {forum.institution}</Text>
                  <Text>{forum.category}</Text>
                  <Text style={{ color: "green" }}>
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
    height: 152,
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
