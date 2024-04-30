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
import { api } from "../../utils/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { decode } from "html-entities";
import React, { useRef, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/FontAwesome";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import { useToast } from "react-native-toast-notifications";

const SingleForum = ({ route, token }) => {
  const toast = useToast();

  const { id } = route.params;
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

  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

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
        `http://137.184.9.57/api/get-forums/`,
        config
      );
      const jsonArray = JSON.stringify(res.data);
      const forumsData = res.data.forums;
      const forumsArray = [forumsData];
      const filteredForum = forumsArray.filter(
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
        "http://137.184.9.57/api/forum-reaction/",
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
        "http://137.184.9.57/api/forum-reaction/",
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
  const handleClickComment = async (uid) => {
    console.log(uid);
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        "http://137.184.9.57/api/discussion-reactions/",
        {
          role: "likes",
          forum: id,
          discussion: uid,
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
        "http://137.184.9.57/api/discussion-reactions/",
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
        "http://137.184.9.57/api/save-forum-discussion/",
        {
          forum: id,
          hasfile: "",
          comment: comment,
        },
        config
      );
      if (res.data === 200) {
        toast.show("comment added");
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
  const AddReplies = async (disId) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://137.184.9.57/api/save-discussion-reply/",
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
        useEffect(() => {
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
                `http://137.184.9.57/api/get-forums/`,
                config
              );
              const jsonArray = JSON.stringify(res.data);
              const forumsData = res.data.forums;
              const forumsArray = [forumsData];
              const filteredForum = forumsArray.filter(
                (forum) => id === forum.forum_id
              );
              setForums(filteredForum);
              setLoading(false);
            } catch (error) {
              console.log("error", error);
              setLoading(false);
            }
          }
          fetchData();
        }, [id]);

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

  return (
    <View style={styles.container} className="pr-1">
      <ScrollView
        className="bg-white"
        styles={{ backgroundColor: "white", borderBottomColor: "grey" }}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
            {forums.map((i) => {
              return (
                <View>
                  <View
                    style={{
                      padding: 10,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text className="text-green-600 text-xl">
                      {i.forum &&
                        i.forum.charAt(0).toUpperCase() + i.forum.slice(1)}
                    </Text>

                    <Text
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        textAlign: "end",
                        flex: 1,
                      }}
                    >
                      {decode(i.description.replace(/<[^>]+>/g, ""))}
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{ color: "grey", fontSize: 13, marginTop: 10 }}
                      >
                        {i.reads} views
                      </Text>
                      <Pressable style={{}}>
                        <Text
                          style={{ color: "red", fontSize: 13, marginTop: 10 }}
                        >
                          Read Article
                        </Text>
                      </Pressable>

                      <Text style={{ color: "green" }}>
                        {" "}
                        End Date: {new Date(i.end_date).toLocaleDateString()}
                      </Text>
                    </View>

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
                      <View>
                        <TouchableOpacity onPress={handleClick}>
                          <Icon name="like2" size={24} color="grey" />
                        </TouchableOpacity>
                        <Text style={{ color: "grey", fontSize: 12 }}>
                          {i.likes}
                        </Text>
                      </View>
                      <View>
                        <TouchableOpacity onPress={handleDislike}>
                          <Icon name="dislike2" size={24} color="grey" />
                        </TouchableOpacity>
                        <Text style={{ color: "grey", fontSize: 12 }}>
                          {i.dislikes}
                        </Text>
                      </View>
                      <View>
                        <Ionicons name="comment" size={24} color="grey" />
                        <Text style={{ color: "grey", fontSize: 12 }}>
                          {i.comments}
                        </Text>
                      </View>
                      <Ionicons name="share" size={24} color="grey" />
                    </View>
                    <View
                      style={{
                        marginBottom: 20,
                        marginTop: 20,
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />
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
                        placeholder="add your comment"
                        keyboardType="text"
                        onChangeText={(text) => setComment(text)}
                      />
                      <View>
                        <Pressable onPress={AddComments} style={styles.button}>
                          <Text style={{ color: "white" }}>Send</Text>
                        </Pressable>
                      </View>
                      {/* <Text
                    style={{ color: "green", marginBottom: 15, marginTop: 15 }}
                  >
                    Comments
                  </Text> */}
                    </View>
                    <ScrollView>
                      {i.discussions.map((comment) => {
                        return (
                          <ScrollView>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: 10,
                                marginBottom: 10,
                              }}
                            >
                              <Ionicons1
                                name="person-circle"
                                size={44}
                                color="red"
                              />
                              <View
                                style={{
                                  display: "flex",
                                  alignItems: "",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <Text style={{ fontSize: 10, color: "red" }}>
                                  @{comment.user}{" "}
                                  {new Date(comment.date_created).getMinutes()}m
                                </Text>
                                <Text style={{ fontSize: 12, width: "100%" }}>
                                  {comment.comment.slice(0, 100)}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 49,
                                justifyContent: "space-between",
                                gap: 20,
                                marginTop: 5,
                              }}
                            >
                              <View>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleClickComment(comment.discustion_id)
                                  }
                                >
                                  <Icon name="like2" size={14} color="grey" />
                                </TouchableOpacity>
                                <Text style={{ color: "grey", fontSize: 12 }}>
                                  {comment.likes}
                                </Text>
                              </View>
                              <View>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDislikeComment(comment.discustion_id)
                                  }
                                >
                                  <Icon
                                    name="dislike2"
                                    size={14}
                                    color="grey"
                                  />
                                </TouchableOpacity>
                                <Text style={{ color: "grey", fontSize: 12 }}>
                                  {comment.dislikes}
                                </Text>
                              </View>
                              <View>
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
                                  <Text style={{ color: "grey", fontSize: 12 }}>
                                    {comment.reply} replies
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View className="bg-slate-100 p-1">
                              {comment.discustion_id === qId1 && (
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
                                    <Ionicons1
                                      name="person-circle"
                                      size={44}
                                      color="green"
                                    />
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
                                      >
                                        <Text style={{ color: "white" }}>
                                          Send
                                        </Text>
                                      </Pressable>
                                    </View>
                                  </View>
                                  {comment.replies.map((reply) => {
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
                                            <View>
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
                                            </View>
                                            <View className="mr-10">
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
                            <Modal
                              animationType="slide"
                              transparent={true}
                              visible={modalVisible}
                              onRequestClose={() => {
                                setModalVisible(false);
                              }}
                            >
                              <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                  <Text>This is a Modal</Text>
                                  <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                  >
                                    <Text>Close Modal</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </Modal>
                            {/* {showReplies && (
                          <View>
                            {comment.replies.map((reply) => {
                              return (
                                <View>
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      gap: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <Ionicons1
                                      name="person-circle"
                                      size={44}
                                      color="red"
                                    />
                                    <View
                                      style={{
                                        display: "flex",
                                        alignItems: "",
                                        justifyContent: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <Text
                                        style={{ fontSize: 10, color: "red" }}
                                      >
                                        @{reply.user}{" "}
                                        {new Date(
                                          reply.date_created
                                        ).getMinutes()}
                                        m
                                      </Text>
                                      <Text
                                        style={{ fontSize: 12, width: "100%" }}
                                      >
                                        {reply.comment.slice(0, 100)}
                                      </Text>
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginLeft: 49,
                                      justifyContent: "space-between",
                                      gap: 20,
                                      marginTop: 5,
                                    }}
                                  >
                                    <View>
                                      <Icon
                                        name="like2"
                                        size={14}
                                        color="grey"
                                      />
                                      <Text
                                        style={{ color: "grey", fontSize: 12 }}
                                      >
                                        {reply.likes}
                                      </Text>
                                    </View>
                                    <View>
                                      <Icon
                                        name="dislike2"
                                        size={14}
                                        color="grey"
                                      />
                                      <Text
                                        style={{ color: "grey", fontSize: 12 }}
                                      >
                                        {reply.dislikes}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        )} */}
                          </ScrollView>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SingleForum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    height: 55,
    width: 55,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 27.5, // half of the width and height to make it a circle
    overflow: "hidden", // to ensure the image doesn't overflow the circle
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
  },
  pdf: {
    flex: 1,
    alignSelf: "stretch",
  },

  logo: {
    height: 55,
    width: 55,
    resizeMode: "contain", // to fit the image within the circle
  },
  container: {
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  btn: {
    height: 30,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    height: 30,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  input1: {
    width: "70%",
    height: 30,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 6,
    height: 30,
    marginTop: 15,
  },
  button: {
    backgroundColor: "green",
    padding: 4,
    width: 43,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
