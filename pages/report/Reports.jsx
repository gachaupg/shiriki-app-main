import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { format } from "date-fns";
import {
  Feather,
  Entypo,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { register, setUser } from "../../redux/features/authSlice";
import { useToast } from "react-native-toast-notifications";
import PhoneInput from "react-phone-number-input/react-native-input";
// import * as ImagePicker from 'expo-image-picker';
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/AntDesign";

import PhoneNumber from "libphonenumber-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const initialState = {
  name: "",
  email: "",
  password: "",
};

const Reports = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [user1, setUser1] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.user?.first_name);
  const [email, setEmail] = useState(user?.user?.email);
  const [forums, setForums] = useState([]);
  console.log("forums", forums);
  const [loading1, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [report, setPost] = useState("");
  const [subject, setTitle] = useState("");
  const [expandedReportIds, setExpandedReportIds] = useState([]);
  const [likeTallies, setLikeTallies] = useState({});
  const [dislikeTallies, setDislikeTallies] = useState({});

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
      const res = await axios.get(`https://dev.shiriki.org/api/get-reports/`, config);

      const forumsData = res.data.list;

      setForums(forumsData);
      setLikeTallies(
        forumsData.reduce((acc, forum) => {
          acc[forum.id] = 0;
          return acc;
        }, {})
      );
      setDislikeTallies(
        forumsData.reduce((acc, forum) => {
          acc[forum.id] = 0;
          return acc;
        }, {})
      );
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  const handleLike = (id) => {
    setLikeTallies((prevTallies) => ({
      ...prevTallies,
      [id]: (prevTallies[id] || 0) + 1,
    }));
  };

  const handleDislike = (id) => {
    setDislikeTallies((prevTallies) => ({
      ...prevTallies,
      [id]: (prevTallies[id] || 0) + 1,
    }));
  };

  const handleSubmit = async () => {
    const token = "YOUR_USER_TOKEN_HERE"; // Replace with actual token logic

    const formData = new FormData();

    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `https://dev.shiriki.org/api/create-report/`,
        {
          report: report,
          subject: subject,
        },
        config
      );

      if (response.status == 200) {
        Alert.alert("Success", "Post created successfully");
        fetchData();
        setPost("")
        setTitle("")
      } else {
        console.log("hhh", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleExpandReport = (id) => {
    if (expandedReportIds.includes(id)) {
      setExpandedReportIds((prevIds) => prevIds.filter((reportId) => reportId !== id));
    } else {
      setExpandedReportIds((prevIds) => [...prevIds, id]);
    }
  };

  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  const [value, setValue] = useState();
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
  const [image, setImage] = useState(null);

  return (
    <ScrollView>
      <View style={styles.login} className="bg-slate-50 mb-5">
        <View className="p-1">
          <View
            className="border rounded-lg bg-white border-slate-200 pb-2"
            style={styles.form}
          >
            <Text style={{ color: "green", fontSize: 19, marginTop: 15 }}>
              Report an Issue
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Full name"
              keyboardType="text"
            />

            <TextInput
              style={styles.input}
              value={email}
              placeholder="email"
              keyboardType="email-address"
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={value}
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              style={styles.textArea}
              placeholder="Issue to report"
              editable
              multiline
              onChangeText={(text) => setPost(text)}
              numberOfLines={12}
            />
            <View
              style={{
                width: 350,
              }}
            >
              <Button title="Attach an Image" />
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 190, height: 200 }}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                className="p-2 text-center"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center">Submit the issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text className="ml-3 text-green-700 font-bold">Previous Reports</Text>

        <View className="relative" style={{ paddingLeft: 12, paddingRight: 12 }}>
          {forums.map((i) => {
            const isExpanded = expandedReportIds.includes(i.id);
            return (
              <TouchableOpacity
                key={i.id}
                className="border border-slate-200 p-2"
                style={[styles.card, isExpanded && styles.expandedCard]}
              >
                <View className="flex flex-col">
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
                    <Text
                      className="text-green-600 text font-bold"
                      style={styles.text}
                    >
                      {i.subject?.length > 22
                        ? `${i.subject.substring(0, 22)}`
                        : i.subject}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="ml-6"
                  >
                    <Text> @{i.full_name}</Text>

                    <Text style={{ color: "green" }}>
                      {" "}
                      Date: {format(new Date(i.date), "MMMM do, yyyy a")}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    letterSpacing: 0.41,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "justify",
                    marginTop: 10,
                    fontFamily: "Helvetica Neue",
                    lineHeight: 20,
                  }}
                >
                  {" "}
                  {isExpanded
                    ? i.description
                    : i.description.length > 230
                    ? `${i.description.substring(0, 230)}...`
                    : i.description}
                    <Text onPress={() => toggleExpandReport(i.id)} style={{ color: "red", marginLeft: 5 }}>
                      {isExpanded ? "Show less" : "Read more"}
                    </Text>
              
                </Text>

                <View className="absolute bottom-0 pt-4" style={styles.reactionsContainer}>
                  {/* <TouchableOpacity
                    onPress={() => handleLike(i.id)}
                    style={styles.reactionButton}
                  > */}
                     <Entypo
                onPress={() =>  handleLike(i.id)}
                name="heart-outlined"
                size={23}
                color="grey"
              />
                    {/* <Ionicons name="like2" size={20} color="green" /> */}
                    <Text>{likeTallies[i.id]}</Text>
                  {/* </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => 
                      handleDislike(i.id)

                    }
                    style={styles.reactionButton}
                  >
                    <Ionicons name="dislike2" size={20} color="red" />
                    <Text>{dislikeTallies[i.id]}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  login: {
    display: "flex",
    marginTop: 10,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
  },
  forumHeader: {
    height: 38.2,
    width: "100%",
    marginLeft: 35,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    padding: 3,
    gap: 20,
    marginTop: 20,
  },
  form: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 10,
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
    width: "97%",
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 6,
    width: "97%",
    marginTop: 15,
  },
  card: {
    marginTop: 17,
    width: "100%",
    backgroundColor: "white",
    height: 220,
    borderRadius: 6,
    padding: 6,
  },
  expandedCard: {
    height: "auto",
  },
  textArea: {
    width: "97%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    padding: 10,
    textAlignVertical: "top",
    height: 100,
  },
  cardBody: {
    color: "white",
    marginTop: "108%",
  },
  icon: {
    marginLeft: "75%",
  },
  reactionsContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 4,
    gap:4
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});