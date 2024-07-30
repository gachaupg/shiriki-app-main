import {
    Button,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
//   import { api } from "../../utils/api";
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useDispatch, useSelector } from "react-redux";
//   import { setUser } from "../../redux/features/authSlice";
  import { decode } from "html-entities";
  import React, { useRef, useEffect, useState } from "react";
  import Icon from "react-native-vector-icons/AntDesign";
  import Ionicons from "react-native-vector-icons/FontAwesome";
  import Ionicons1 from "react-native-vector-icons/Ionicons";
  import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
  import { useToast } from "react-native-toast-notifications";

const Replies = ({route }) => {
    const toast = useToast();
    const { id } = route.params; // Destructuring parameters from route.params
    const { id1 } = route.params; // Destructuring parameters from route.params

//   const { id } = route.params;
  // console.log("====================================");
  // console.log("token", token);
  // console.log("====================================");
  const onlineSource = {
    uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    cache: true,
  };
  const [pdfSource, setPdfSource] = useState(onlineSource);
  const pdfRef = useRef();

  const [replies, setReplies] = useState(false);

  const { user } = useSelector((state) => state.auth);
 console.log('id',id1);
  const [forums, setForums] = useState([]);
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
      // console.log("token", token);
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(
        `https://dev.shiriki.org/api/get-forums/`,
        config
      );
      const jsonArray = JSON.stringify(res.data);

      const forumsData = res.data.forums;
      const forumsArray = [forumsData]; 
     const data= forumsArray?.sort(compare);
      const filteredForum = data.filter(
        (forum) => id === forum.forum_id
      );

      setForums(filteredForum);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  // State to track loading state of the button

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
        toast.show("liked successfully");
        fetchData(); // Fetch data again after successful like
      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Dislike:", error);
    } finally {
    }
  };
  const handleClickComment = async (id1,uid) => {
    console.log(id1);
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
          "role":"likes",
          "forum":id1,
          "discussion":uid
          },
        config
      );
      console.log(data.data);
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
  const handleDislikeComment = async (uid) => {
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
          forum: id,
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
  const AddComments = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
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
      console.log(res.data);
      if (res.data.code === 200) {
        toast.show("comment added");
        setComment("")
        fetchData();

      }
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error.JSON());
    } finally {
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
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
  const[rep,setRep]=useState(false)
  const AddReplies = async (disId) => {
    try {
      setRep(true)
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
    return `${daysDifference}days`; // More than a day, display days
  }
};
  return (
    <View>
      <View className="bg-white p-1">
        {id === id1 && (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 15,
              }}
            >
              <Ionicons1 name="person-circle" size={44} color="green" />
              <TextInput
                style={styles.input1}
                placeholder="add your reply"
                keyboardType="text"
                onChangeText={(text) => setReply(text)}
              />
              <View>
                <Pressable
                  onPress={() => {
                    // Call the AddReplies function here
                    AddReplies(comment.discustion_id);
                  }}
                  style={styles.button}
                  className="w-19"
                >
                  <Text style={{ color: "white" }}>
                    {rep ? "loading..." : "Send"}
                  </Text>
                </Pressable>
              </View>
            </View>
            {forums.discussions?.replies.map((reply) => {
              return (
                <View className="flex flex-row">
                  <Ionicons1 name="person-circle" size={44} color="green" />
                  <View className="mt-2 flex items- items-start  justify-between">
                    <Text className="text-xs mr-7 text-red-600">
                      @{reply.user.slice(0, 100)}
                    </Text>

                    <Text className="text-xs pr-4 ">
                      {" "}
                      {reply.comment.slice(0, 100)}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 40,
                        marginTop: 16,
                      }}
                    >
                      <View className="flex ">
                        <TouchableOpacity onPress={handleClick}>
                          <Icon name="like2" size={14} color="grey" />
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
                      <View>
                        <TouchableOpacity onPress={handleDislike}>
                          <Icon name="dislike2" size={14} color="grey" />
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: "grey",
                            fontSize: 12,
                          }}
                        >
                          {reply.dislikes}
                        </Text>
                      </View>
                      <View className="mr-10">
                        <Ionicons name="comment" size={14} color="grey" />
                        <Text
                          style={{
                            color: "grey",
                            fontSize: 12,
                          }}
                        >
                          {reply.comments}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Replies;

const styles = StyleSheet.create({});
