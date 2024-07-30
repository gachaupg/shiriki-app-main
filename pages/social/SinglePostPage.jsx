import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/AntDesign";
import { formatDistanceToNow } from 'date-fns';

import {
  Ionicons,
  Feather,
  Entypo,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { format } from "date-fns";
import Ionicons1 from "react-native-vector-icons/MaterialCommunityIcons";

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  feedImage: { width: "100%", height: 300, borderRadius: 15 },
  statsRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  iconsContainer: { flexDirection: "row" },
  iconCard: { flexDirection: "row", marginRight: 10 },
  statCount: { marginLeft: 1, color: "grey" },
  feedContent: { color: "grey", marginTop: 10 },
  viewComments: { color: "grey", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 5,
    borderRadius: 5,
    flex: 1,
  },
  button: { padding: 5, justifyContent: "center" },
});

const SinglePostPage = ({ route, navigation }) => {
  const [item, setItem] = useState([]);
  const { id } = route.params; // Access the `id` parameter
  const { user } = useSelector((state) => state.auth);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const toast = useToast();
  const url = "https://dev.shiriki.org/api";
  const [isReplying, setIsReplying] = useState(false);
  console.log(id);
  console.log('new data',comments);
  // useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `https://dev.shiriki.org/api/get-single-post/`,
          { instance: id },
          config
        );
    
        // Assuming the API response structure has a 'code' field for status
        // if (response.data.code === 200) {
          // Reverse the comments to have the latest ones on top
          const reversedComments = response.data.list.reverse();
          setComments(reversedComments);
          setItem(response.data.instance);
        // }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    

    // fetchData();
  // }, [id, user.token]);

  useEffect(() => {
    fetchData();
  }, [id, user.token]);

  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // State to track which comment is being replied to
  const [comment, setComment] = useState("");
  const [load1, setLoad1] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleClick = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `https://dev.shiriki.org/api/post-reactions/`,
        {
          instance: id,
          role: "likes",
        },
        config
      );

      if (data.data.code === 200) {
        toast.show("Liked successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `${url}/post-comment-reaction/`,
        {
          instance: commentId,
          role: "likes",
        },
        config
      );

      if (data.data.code === 200) {
        toast.show("Liked successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const addComment = async () => {
    if (!comment.trim()) {
      toast.show("Comment cannot be empty");
      return;
    }
    try {
      setLoad1(true);
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${url}/post-comment/`,
        {
          instance: id,
          comment: comment,
        },
        config
      );

      if (res.data.code === 200) {
        toast.show("Comment added");
        fetchData();
        setComment("");
        setInputText("");
        setReplyingTo(false);
      } else {
        toast.show(res.data.status);
      }
    } catch (error) {
      console.error("Error adding Comment:", error);
    } finally {
      setLoad1(false);
    }
  };

  const addReply = async (commentId) => {
    if (!reply.trim()) {
      toast.show("Reply cannot be empty");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${url}/post-comment-reply/`,
        {
          instance: id,
          comment_id: commentId,
          comment: reply,
        },
        config
      );

      if (res.data.code === 200) {
        toast.show("Reply added");
        setReply("");
        setReplyingTo(null);
        setInputText("");
        fetchData();
        setReplyingTo(false);
      } else {
        toast.show(res.data.status);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleAddCommentOrReply = () => {
    if (replyingTo) {
      addReply(replyingTo);
    } else {
      addComment();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        className="bg-white mt-4"
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
            <TouchableOpacity onPress={() => navigation.navigate("Social")}>
              <Icon name="arrowleft" color="grey" size={30} />
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <ScrollView>
        <View className="bg-white p-2">
          <View className="flex flex-row items-center mb-3">
            <Ionicons
              style={{ display: "flex", flexDirection: "row" }}
              name="person-circle"
              size={37}
              color="grey"
            />
            <View className="flex flex-col ml-2">
              <Text style={{ fontSize: 14, color: "green" }}>
                @{item.full_name}
              </Text>
              <View className="flex flex-row justify-between w-full pr-8">
                <Text className="text-slate-700" style={{ fontSize: 12 }}>
                    {item.subject}
                  </Text>
                <Text
                  className="ml-1 text-red-700 italic"
                  style={{ fontSize: 12 }}
                >
                  {/* Posted on: {format(new Date(item.date), "MMMM do, yyyy hh:mm")} */}
                </Text>
              </View>
            </View>
          </View>
          <Image
            source={{
              uri: "https://res.cloudinary.com/pitz/image/upload/v1718116589/download_4_p65s20.jpg",
            }}
            style={styles.feedImage}
          />
          <View style={styles.statsRow}>
            <View style={styles.iconsContainer}>
              <View style={styles.iconCard}>
                <Entypo
                  onPress={handleClick}
                  name="heart-outlined"
                  size={23}
                  color="grey"
                />
                <Text style={styles.statCount}>{item?.likes}</Text>
              </View>
              <View style={styles.iconCard}>
                <FontAwesome5 name="comment" size={19} color="grey" />
                <Text style={styles.statCount}>{comments.length}</Text>
              </View>
              <View style={styles.iconCard}>
                <AntDesign name="eyeo" size={23} color="grey" />
                <Text style={styles.statCount}>{comments.length}</Text>
              </View>
            </View>
            <Feather name="more-horizontal" size={24} color="grey" />
          </View>
          <Text
            className="text-slate-600"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              textAlign: "justify",
              marginTop: 10,
              marginBottom: 10,
              fontFamily: "Helvetica Neue",
              lineHeight: 20,
            }}
          >
            {item?.post}
          </Text>
          <View>
            <Text className="text-slate-400">Comments</Text>
            {comments.map((comment) => (
              <View key={comment.comment_id}>
                <View className="flex mr-5 flex-row">
                  <Ionicons1 size={29} name="account-circle" />
                  <View className="flex flex-shrink border border-slate-100 rounded-lg m-1 p-1 bg-slate-100 max-w-full">
                    <View className="flex-shrink border border-slate-100 rounded-lg m-1 p-1 bg-slate-100 max-w-full">
                      <Text className="text-xs text-black font-bold">
                        {comment.user } 
                      </Text>
                      <Text className="text-slate-800">{comment.comment} </Text>
                    </View>
                    <View className="flex bg-slate-100 p-1 flex-row">
                      <View style={styles.iconCard}>
                        <Entypo
                          onPress={() => {
                            handleLikeComment(comment.comment_id);
                            setReplyingTo(false);
                          }}
                          name="heart-outlined"
                          size={23}
                          color="grey"
                        />
                        <Text style={styles.statCount}>{comment.likes}</Text>
                      </View>
                      <Text
                        className="text-slate-500"
                        onPress={() => {
                          navigation.navigate("Replies", {
                            data: comment,
                            id: id,
                            uid: comment.comment_id,
                          });
                          // setReplyingTo(comment.comment_id);
                          // setIsReplying(true);
                          // setInputText("");
                        }}
                      >
                        Replies{comment.replies.length}
                      </Text>
                      <Text className="ml-5">{formatDistanceToNow(new Date(comment.date_created), { addSuffix: true })}</Text>
                    </View>
                    
                    {comment.replies.slice(0, 1).map((i) => (
                      <View
                        key={i.reply_id}
                        className="flex-shrink border border-slate-100 rounded-lg m-1 p-1 bg-slate-100 max-w-full"
                      >
                        <TouchableOpacity onPress={() => {
                          navigation.navigate("Replies", {
                            data: comment,
                            id: id,
                            uid: comment.comment_id,
                          });
                          // setReplyingTo(comment.comment_id);
                          // setIsReplying(true);
                          // setInputText("");
                        }}  className="flex flex-row items-center">
                          <Ionicons1 size={29} name="account-circle" />
                          <View className="p-1 flex flex-col bg-slate-300 rounded-lg">
                            <Text className="text-xs text-black font-bold">
                              {i.user}
                            </Text>
                            <Text>{i.reply}</Text>
                           </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className="w-full h-1 bg-slate-300" />
        </View>
      </ScrollView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
        <View
          style={{
            flexDirection: "row",
            padding: 2,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <TextInput
            className="border mb-1 p-1 w-72 rounded-lg border-slate-200"
            style={styles.input1}
            placeholder={isReplying ? "Add your reply" : "Add your comment"}
            keyboardType="text"
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              if (replyingTo) {
                setReply(text);
              } else {
                setComment(text);
              }
            }}
            multiline
          />
          <Pressable onPress={handleAddCommentOrReply} style={styles.button}>
            <Ionicons size={35} color="green" name="send" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SinglePostPage;
