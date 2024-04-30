import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchableDropdown from "react-native-searchable-dropdown";
import { useSelector } from "react-redux";
import axios from "axios";
import { decode } from "html-entities";

const Surveys = ({ navigation }) => {
  const [active, setActive] = useState(true);
  const [active1, setActive1] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      navigation.navigate("Home"); // Navigate to Home screen if user is truthy
    } else {
      navigation.navigate("Login"); // Navigate to Login screen if user is falsy
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = user.token;
        const config = {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.get(
          `http://137.184.9.57/api/get-surveys/`,
          config
        );
        const data = res.data.surveys;
        setSurveys(data);
        setLoading(false); // Data fetched, loading complete
      } catch (error) {
        console.log("Error fetching surveys:", error);
        setLoading(false); // Error occurred, loading complete
      }
    }

    fetchData();
  }, []);

  // Render function for each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("SingleSurvey", { id: item.survey_id })}
      style={styles.card}
    >
      <Text style={{ color: "red", fontSize: 15, fontWeight: "500" }}>
        {decode(item.name.replace(/<[^>]+>/g, ""))}
      </Text>
      <Text style={{ marginTop: 13 }}>
        {decode(item.description.replace(/<[^>]+>/g, "").slice(0, 200))}
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text> {item.institution}</Text>
        <Text>{item.category}</Text>
        <Text style={{ color: "green" }}>
          {" "}
          End Date: {new Date(item.end_date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          Surveys
        </Text>
        <Text style={{ width: "100%" }}>
          Lorem Ipsum is simply dummy text of the printing .
        </Text>
        <View style={styles.forumHeader}>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
            <Button
              onPress={() => setActive(true)}
              color={active ? "green" : "grey"}
              style={{ borderRadius: 20 }}
              title="Active"
            />
          </View>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
            <Button
              onPress={() => setActive1(true)}
              color={active1 ? "green" : "grey"}
              style={{ borderRadius: 20 }}
              title="Past"
            />
          </View>
          <View style={{ backgroundColor: "grey", borderRadius: 25 }}></View>
        </View>
        <View style={{ padding: 1 }}>
          {loading ? (
            // If data is loading, show loading indicator
            <ActivityIndicator size="large" color="green" />
          ) : (
            // If data is loaded, render FlatList with surveys
            <FlatList
              data={surveys}
              renderItem={renderItem}
              keyExtractor={(item) => item.survey_id.toString()}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Surveys;

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
