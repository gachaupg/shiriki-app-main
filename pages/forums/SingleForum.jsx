import { StyleSheet, Text, View } from "react-native";
import React from "react";

import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { decode } from "html-entities";
import { useRef, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/FontAwesome";
import Ionicons1 from "react-native-vector-icons/Ionicons";

// import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons4 from "react-native-vector-icons/MaterialIcons";
import Ionicons5 from "react-native-vector-icons/AntDesign";
import Ionicons7 from "react-native-vector-icons/Entypo";
import { Picker } from "@react-native-picker/picker";

import Ionicons6 from "react-native-vector-icons/Feather";
import { useToast } from "react-native-toast-notifications";
import { Icons } from "react-toastify";

const SingleForum = ({ route, navigation }) => {
  const toast = useToast();
  const { id } = route.params; // Access the `id` parameter
  console.log("====================================");
  console.log("token", id);
  console.log("====================================");
  const onlineSource = {
    uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    cache: true,
  };
  const [pdfSource, setPdfSource] = useState(onlineSource);
  const pdfRef = useRef();

  const [replies, setReplies] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [forums, setForums] = useState([]);
  console.log('forums',forums);
  const [loading, setLoading] = useState(true);
  const url = "https://dev.shiriki.org/api";
  function compare(a, b) {
    if (a.forum_id < b.forum_id) {
      return 1;
    }
    if (a.forum_id > b.forum_id) {
      return -1;
    }
    return 0;
  }

  async function fetchData() {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Token 00e5dd8e3a804d06734b9add9ba85b29b98a336d`,
          "Content-Type": "application/json",
        },
      };
      console.log(token);

      const res = await axios.post(
        `https://dev.shiriki.org/api/view-forum-comments/`,
         {
          forum:id
          },
        config
      );
      console.log(res.data);
      const forumsData = res.data.forum;
      const forumsArray = [forumsData];
      // const data = forumsArray?.sort(compare);
      console.log("====================================");
      console.log("", forumsArray);
      console.log("======forumseee==============================");
      console.log(forumsArray);
      setForums(forumsArray);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);
  const [discussionsToShow, setDiscussionsToShow] = useState(4); // State variable to track the number of discussions to show initially

  const loadAllDiscussions = () => {
    setDiscussionsToShow(forums.discussions.length);
  };

  const handleClick = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `${url}/forum-reaction/`,
        {
          role: "likes",
          forum: id,
        },
        config
      );
      if (data.data.code === 200) {
        toast.show("liked successfully");
        fetchData(); // Fetch data again after successful like
      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding reaction:", error);
    } finally {
    }
  };
  const handleDislike = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `${url}/forum-reaction/`,
        {
          role: "dislikes",
          forum: id,
        },
        config
      );
      if (data.data.code === 200) {
        toast.show("Disliked successfully");
        fetchData(); // Fetch data again after successful like
      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Dislike:", error);
    } finally {
    }
  };
  const handleClickComment = async (id1, uid) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `https://dev.shiriki.org/api/discussion-reactions/ `,
        {
          role: "likes",
          forum: id1,
          discussion: uid,
        },
        config
      );
      console.log(data.data);
      if (data.data.code === 200) {
        toast.show("liked successfully");
        fetchData(); 
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    } finally {
    }
  };
  const handleDislikeComment = async (id1, uid) => {
    console.log(uid);
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `${url}/discussion-reactions/`,
        {
          role: "dislikes",
          forum: id1,
          discussion: uid,
        },
        config
      );
      if (data.data.code === 200) {
        toast.show("disliked successfully");
        fetchData(); // Fetch data again after successful like
      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding reaction:", error);
    } finally {
    }
  };
  const [comment, setComment] = useState("");
  const [load1, setLoad1] = useState(false);
  const AddComments = async () => {
    try {
      setLoad1(true); // Set loading state to true when adding a comment

      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `https://dev.shiriki.org/api/save-forum-discussion/`,
        {
          forum: id,
          hasfile: "",
          comment: comment,
        },
        config
      );
      console.log(comment);
      if (res.data.code === 200) {
        toast.show("comment added");
        fetchData();
      } else {
        toast.show(res.data.status);
      }
    } catch (error) {
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setLoad1(false);
      // Reset loading state to false after comment is added
    }
  };

  const [showChoice, setShowChoice] = useState(false);
  const [qId, setQid] = useState("");
  const [qId1, setQid1] = useState("");
  // console.log("uid", qId);
  // console.log("uid", qId1);
  const handleShowChoice1 = (id) => {
    setQid1(id);
  };
  const [modalVisible1, setModalVisible1] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleShowChoice = (choiceId) => {
    const questionsData = forums.reduce((acc, forum) => {
      acc.push(...forum.discussions);
      return acc;
    }, []);

    questionsData.forEach((forum) => {
      if (forum.discustion_id === choiceId) {
        setShowChoice(true);
        console.log(showChoice);
        console.log("id", choiceId);
        setQid(forum.discustion_id);
      }
    });
  };
  const [reply, setReply] = useState("");
  // console.log("====================================");
  // console.log(reply);
  // console.log("====================================");
  const [rep, setRep] = useState(false);
  const AddReplies = async (disId) => {
    try {
      setRep(true);
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${url}/save-discussion-reply/`,
        {
          forum: id,
          discusion: disId,
          comments: reply,
        },
        config
      ); // Pass config as the third argument to axios.post
      // If the request is successful, you can handle any additional logic here
      if (res.data.code === 200) {
        toast.show("Reply added successfully");
        setReplies("");
        fetchData();
        setRep(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error.JSON());
      setLoading(false);
    } finally {
    }
  };

  function timestampToMinutes(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return totalMinutes;
  }
  // Function to calculate the difference in minutes between two dates
  const getMinutesDifference = (creationDate) => {
    const currentDate = new Date();
    const diffMs = currentDate - new Date(creationDate);
    const minutesDifference = Math.floor(diffMs / (1000 * 60));
    return minutesDifference;
  };
  const formatTimeDifference = (creationDate) => {
    const currentDate = new Date();
    const diffMs = currentDate - new Date(creationDate);
    const minutesDifference = Math.floor(diffMs / (1000 * 60));
    const hoursDifference = Math.floor(diffMs / (1000 * 60 * 60));
    const daysDifference = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutesDifference < 60) {
      return `${minutesDifference}mins`; // Less than an hour, display minutes
    } else if (hoursDifference < 24) {
      return `${hoursDifference}hrs`; // Less than a day, display hours
    } else {
      return `${daysDifference}d`; // More than a day, display days
    }
  };
  // const { data } = route.params; // Accessing the data prop from route.params

  // console.log("data dgdgdg", data);
  const [picked, setPicked] = useState(1.15);

  const [showAllComments, setShowAllComments] = useState(false);
  const initialCommentsToShow = 4;
  const [show, setShow] = useState(false);
  const showComments = () => {
    if (show === false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  return (
    <View className="pt-4 bg-wite" style={styles.container}>
      <View className="bg-gray-50 p-2" style={styles.content}>
        <View
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            // backgroundColor: "white",
          }}
        >
          <View className="flex flex-row gap-5 items-center">
            <Text>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Icon name="arrowleft" color="grey" size={30} />
              </TouchableOpacity>
            </Text>
          </View>
        </View>
        <ScrollView>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {forums.map((i) => {
                return (
                  <View className="bg-gray-50 pr-3 " style={styles.card}>
                    <View>
                      <View style={{}} className="  pr-3">
                        <View>
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
                            {decode(i.description.replace(/<[^>]+>/g, ""))}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            // justifyContent: "space-between",
                            borderRadius: 20,
                            // marginTop:10
                          }}
                        >
                          <Text
                            style={{
                              color: "grey",
                              fontSize: 13,
                              // marginTop: 10,
                            }}
                          >
                            {i.likes} Upvotes.
                          </Text>

                          <Text
                            style={{
                              color: "grey",
                              fontSize: 13,
                              // marginTop: 10,
                            }}
                          >
                            {i.comments} comments .
                          </Text>
                          <Text
                            style={{
                              color: "grey",
                              fontSize: 13,
                              // marginTop: 10,
                            }}
                          >
                            {i.reads} views
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: 20,
                            marginTop: 10,
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "#f0f0f0", // Light grey
                              borderRadius: 20,
                              paddingLeft: 5,
                              paddingRight: 5,
                              height: 30,
                              // padding: 5
                            }}
                          >
                            <Ionicons7
                              onPress={handleClick}
                              name="arrow-bold-up"
                              size={16}
                              color="grey"
                            />
                            <Text
                              style={{ fontSize: 16, marginLeft: 2 }}
                            ></Text>
                            <Text 
                              style={{
                                fontSize: 14,
                                marginLeft: 2,
                                color: "grey",
                              }}
                            >
                              Upvotes. {i.likes}
                            </Text>
                            <View
                              style={{
                                width: 1,
                                height: 30,
                                backgroundColor: "grey",
                                marginLeft: 3,
                              }}
                            />
                            <Ionicons7
                              onPress={handleDislike}
                              style={{ position: "relative" }}
                              name="arrow-bold-down"
                              size={16}
                              color="grey"
                            />

                            <Text
                              style={{
                                fontSize: 16,
                                marginLeft: 2,
                                color: "grey",
                              }}
                            >
                              {i.dislikes}
                            </Text>
                          </View>

                          {/* <Text
                            style={{
                              color: "grey",
                              fontSize: 13,
                              marginTop: 10,
                            }}
                          >
                            {i.reads} views
                          </Text> */}
                          <Pressable style={{}}>
                            {/* <Text
                              style={{
                                color: "red",
                                fontSize: 13,
                                marginTop: 10,
                              }}
                            >
                              Read Article
                            </Text> */}
                          </Pressable>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          ></View>
                        </View>
                      </View>
                    </View>
                    {/* <Text> */}
                    <View>
                      <View
                        style={{
                          width: "100%",

                          height: 0.5,
                          backgroundColor: "grey",
                          marginTop: 10,
                        }}
                      ></View>
                      
                    </View>
                    <View className="p-1 pr-3 mr-5 bg-slate-100  w-96 rounded-lg">
        <Text
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            // marginLeft: 20,
          }}
        >
          <View>
            <TextInput
              className="border border-slate-200"
              style={styles.input1}
              placeholder="add your comment"
              keyboardType="text"
              value={comment}
              onChangeText={(text) => setComment(text)}
              multiline
            />
          </View>
          <View>
            {/* <Text></Text> */}
          </View>
          <View className='mr-20' >
            {load1 ? (
              <Text style={styles.button}>sending</Text>
            ) : (
              <Pressable
                onPress={() => {
                  AddComments();
                  setComment(""); // Clear comment input field
                }}
                style={styles.button}
              >
                <Ionicons3 size={35} color="green" name="send" />
              </Pressable>
            )}
          </View>
        </Text>
      </View>
                    <ScrollView style={{ marginBottom: 50 }}>
                      <View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            // marginTop: 10,
                            // marginBottom: 10,
                          }}
                        >
                          <Text
                          className="mt-4"
                            style={{
                              color: "grey",
                            }}
                          >
                            Comments
                          </Text>
                          <View>
                            <Picker
                              selectedValue={picked}
                              style={{ width: 150 }}
                              onValueChange={(itemValue, itemIndex) =>
                                setPicked(itemValue)
                              }
                            >
                              
                              <Picker.Item
                              className="text-green-700"
                                label="Filter By :"
                               
                              />
                              <Picker.Item label="Most upvotes" value={1.16} />
                              <Picker.Item label="Most Relevant" value={1.17} />
                              <Picker.Item label="Most downloads" value={1.18} />
                             
                            </Picker>
                          </View>
                          {/* <Text
                            className="mr-4"
                            style={{
                              color: "green",
                            }}
                          >
                            Most Relevant <Ionicons5 name="left" />{" "}
                            <Ionicons5 name="right" />
                          </Text> */}
                        </View>
                        <View>
                          {i.discussions
                            .sort(
                              (a, b) =>
                                new Date(b.date_created) -
                                new Date(a.date_created)
                            )
                            .slice(
                              0,
                              showAllComments
                                ? undefined
                                : initialCommentsToShow
                            )

                            .map((comment) => {
                              return (
                                <ScrollView className="w-full  rounded-sm ">
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      // gap: 5,
                                      // marginBottom: 10,
                                    }}
                                  >
                                    <Ionicons1
                                      name="person-circle"
                                      size={44}
                                      color="grey"
                                    />
                                    <View
                                      style={{
                                        display: "flex",
                                        // backgroundColor: "white",
                                        padding: 8,
                                        borderBottomLeftRadius: 10,
                                        borderBottomRightRadius: 10,
                                        borderTopRightRadius: 10,
                                        flexShrink: 1,
                                        flexGrow: 1,
                                      }}
                                      className="p-2 mr-3  bg-white border border-slate-200 shadow-md"
                                    >
                                      <View
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Text
                                          className="text-red-600 text-bold"
                                          style={{
                                            fontSize: 13,
                                            fontWeight: "400",
                                          }}
                                        >
                                          @{comment.user}{" "}
                                          {formatTimeDifference(
                                            comment.date_created
                                          )}
                                        </Text>
                                        <Ionicons6 name="more-vertical" />
                                      </View>
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          width: "100%",
                                        }}
                                      >
                                        {comment.comment.slice(0, 100)}
                                      </Text>
                                      <View
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          // marginLeft: 82,
                                          gap: 10,
                                          alignItems: "center",
                                          // marginBottom: 10,
                                        }}
                                      >
                                        <View
                                          style={{
                                            marginTop: 8,
                                            display: "flex",
                                            width: 90,
                                            flexDirection: "row",
                                            alignItems: "center",

                                            borderRadius: 20,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            height: 30,
                                            // padding: 5
                                          }}
                                          className="border border-slate-100"
                                        >
                                          <Ionicons7
                                            onPress={() =>
                                              handleClickComment(
                                                comment.forum_id,
                                                comment.discustion_id
                                              )
                                            }
                                            name="arrow-bold-up"
                                            size={16}
                                            color="grey"
                                          />
                                          <Text
                                            style={{
                                              fontSize: 16,
                                              marginLeft: 2,
                                            }}
                                          ></Text>
                                          <Text
                                            style={{
                                              fontSize: 16,
                                              marginLeft: 2,
                                              color: "grey",
                                            }}
                                          >
                                            {comment.likes}
                                          </Text>
                                          <View
                                            style={{
                                              width: 1,
                                              height: 30,
                                              backgroundColor: "grey",
                                              marginLeft: 3,
                                            }}
                                          />
                                          <Ionicons7
                                            onPress={() =>
                                              handleDislikeComment(
                                                comment.forum_id,
                                                comment.discustion_id
                                              )
                                            }
                                            style={{ position: "relative" }}
                                            name="arrow-bold-down"
                                            size={16}
                                            color="grey"
                                          />
                                          {/* <Ionicons4
  }
    name="favorite-outline"
    size={10}
    color="red"
  /> */}
                                          <Text
                                            style={{
                                              fontSize: 16,
                                              marginLeft: 2,
                                              color: "grey",
                                            }}
                                          >
                                            {comment.dislikes}
                                          </Text>
                                        </View>
                                        {/* <View
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              gap: 5,
                                            }}
                                           >
                                            <TouchableOpacity
                                              onPress={() =>
                                                handleClickComment(
                                                  comment.forum_id,
                                                  comment.discustion_id
                                                )
                                              }
                                            >
                                              <Icon
                                                name="like2"
                                                size={14}
                                                color="grey"
                                              />
                                            </TouchableOpacity>
                                            <Text
                                              style={{
                                                color: "grey",
                                                fontSize: 12,
                                              }}
                                            >
                                              {comment.likes}
                                            </Text>
                                          </View> */}
                                        {/* <View
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                            }}
                                           >
                                            <TouchableOpacity
                                              onPress={() =>
                                                handleDislikeComment(
                                                  comment.forum_id,
                                                  comment.discustion_id
                                                )
                                              }
                                            >
                                              <Icon
                                                name="dislike2"
                                                size={14}
                                                color="grey"
                                              />
                                            </TouchableOpacity>
                                            <Text
                                              style={{
                                                color: "grey",
                                                fontSize: 14,
                                                marginLeft: 6,
                                              }}
                                            >
                                              {comment.dislikes}
                                            </Text>
                                          </View> */}
                                        {/* <TouchableOpacity
                                  onPress={() => {
                                    handleShowChoice1(comment.discustion_id);
                                  }}
                                >
                                  <View className="h-6 w-20 mr-3 bg-slate-100 flex flex-row items-center justify-around rounded-2xl">
                                    <Ionicons3
                                      name="reply-circle"
                                      size={16}
                                      color="grey"
                                    />
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleShowChoice1(comment.discustion_id)
                                      }
                                    >
                                      <Text
                                        style={{ color: "grey", fontSize: 12 }}
                                      >
                                        {comment.reply} replies
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </TouchableOpacity> */}
                                      </View>
                                    </View>
                                  </View>

                                  <View className=" rounded-lg p-3  ml-20  ">
                                    {comment.discustion_id === qId1 && (
                                      <View className="bg-slate-50 p-1 pr-5">
                                        <Text className="text-red-600">
                                          Replies
                                        </Text>
                                        <View className="flex items-center flex-row gap-6 pt-2">
                                          <TextInput
                                            style={styles.input1}
                                            placeholder="add your reply"
                                            keyboardType="text"
                                            onChangeText={(text) =>
                                              setReply(text)
                                            }
                                            multiline
                                          />
                                          <View className="mr-5">
                                            {rep ? (
                                              <Text>sending</Text>
                                            ) : (
                                              <TouchableOpacity
                                                onPress={() => {
                                                  // Call the AddReplies function here
                                                  AddReplies(
                                                    comment.discustion_id
                                                  );
                                                }}
                                                style={styles.button}
                                              >
                                                <Text
                                                  style={{ color: "white" }}
                                                >
                                                  Send
                                                </Text>
                                              </TouchableOpacity>
                                            )}
                                          </View>
                                        </View>

                                        <View
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingTop: 15,
                                          }}
                                        ></View>
                                        {comment.replies
                                          .sort(
                                            (a, b) =>
                                              new Date(b.date_created) -
                                              new Date(a.date_created)
                                          )

                                          .map((reply) => {
                                            return (
                                              <View className="flex flex-row">
                                                <Ionicons1
                                                  name="person-circle"
                                                  size={44}
                                                  color="green"
                                                />
                                                <View className="mt-2 flex items- items-start  justify-between">
                                                  <Text className="text-xs mr-7 text-red-600">
                                                    @{reply.user.slice(0, 100)}
                                                  </Text>

                                                  <Text className="text-xs pr-4 ">
                                                    {" "}
                                                    {reply.comment.slice(
                                                      0,
                                                      100
                                                    )}
                                                  </Text>
                                                  <View
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "row",
                                                      alignItems: "center",
                                                      justifyContent:
                                                        "space-between",
                                                      gap: 40,
                                                      marginTop: 16,
                                                    }}
                                                  >
                                                    <View className="h-6 w-20 bg-slate-200 flex flex-row items-center justify-around rounded-2xl">
                                                      <TouchableOpacity
                                                        onPress={handleClick}
                                                      >
                                                        <Icon
                                                          name="like2"
                                                          size={14}
                                                          color="grey"
                                                        />
                                                      </TouchableOpacity>
                                                      <Text
                                                        style={{
                                                          color: "grey",
                                                          fontSize: 12,
                                                        }}
                                                      >
                                                        {reply.likes}
                                                      </Text>
                                                    </View>
                                                    <View className="h-6 w-20 bg-slate-200 flex flex-row items-center justify-around rounded-2xl">
                                                      <TouchableOpacity
                                                        onPress={handleDislike}
                                                      >
                                                        <Icon
                                                          name="dislike2"
                                                          size={14}
                                                          color="grey"
                                                        />
                                                      </TouchableOpacity>
                                                      <Text
                                                        style={{
                                                          color: "grey",
                                                          fontSize: 12,
                                                        }}
                                                      >
                                                        {reply.dislikes}
                                                      </Text>
                                                      <Text
                                                        style={{
                                                          marginBottom: 200,
                                                        }}
                                                      >
                                                        jjjj
                                                      </Text>
                                                    </View>
                                                    {/* <View className="h-6 w-20 bg-slate-200 flex flex-row items-center justify-around rounded-2xl">
                                              <Ionicons
                                                name="comment"
                                                size={14}
                                                color="grey"
                                              />
                                              <Text
                                                style={{
                                                  color: "grey",
                                                  fontSize: 12,
                                                }}
                                              >
                                                {comment.replies.length}
                                              </Text>
                                            </View> */}
                                                  </View>
                                                </View>
                                              </View>
                                            );
                                          })}
                                      </View>
                                    )}
                                  </View>
                                </ScrollView>
                              );
                            })}
                        </View>
                      </View>
                      {!showAllComments && (
                        <TouchableOpacity
                          style={
                            {
                              // marginBottom: 370,
                            }
                          }
                          className="bg-slate-100  border border-slate-200 w-36 mb-10 rounded-lg p-1 flex items-center justify-center ml-32"
                          onPress={() => setShowAllComments(true)}
                        >
                          <Text className="text-grey">Load All Comments</Text>
                        </TouchableOpacity>
                      )}
                      {showAllComments && (
                        <TouchableOpacity
                          className="bg-slate-300 w-36 rounded-lg p-1 flex items-center justify-center ml-32"
                          onPress={() => setShowAllComments(false)}
                        >
                          <Text className="text-grey">close</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>

                    {/* </Text> */}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
      
    </View>
  );
};

export default SingleForum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",

    // padding: 1,
  },
  card: {
    // marginTop: 17,
    width: 390,
    // backgroundColor: "white",
    // borderRadius: 6,
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
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 3,
  },
  button: {
    // backgroundColor: "green",
    padding: 4,
    width: 43,
    borderRadius: 5,
    // marginRight: 4,
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomBar: {
    // borderTopColor: "grey",
    // borderWidth: 1,
    height: 70, // Adjust the height as needed
    backgroundColor: "white", // Example background color
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  input1: {
    width: 300,
    height: 40,
    padding: 10, // Adjust this value to change the padding/margin around the placeholder text

    // width: 250,
    // height: 50,
    // borderColor: "grey",
    // borderWidth: 1,
    borderRadius: 10,
    // backgroundColor: "#f0f0f0",
    // paddingHorizontal: 10,
  },
});
