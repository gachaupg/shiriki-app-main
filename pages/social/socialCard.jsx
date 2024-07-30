import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Ionicons,
  Feather,
  Entypo,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { format } from "date-fns";
import Ionicons1 from "react-native-vector-icons/MaterialCommunityIcons";

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
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

export default function FeedCard({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [item, setForums] = useState([]);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const toast = useToast();
  const url = "https://dev.shiriki.org/api";
  const commentInputRef = useRef(null);
console.log('item',comments);
  function compare(a, b) {
    if (a.comment_id < b.comment_id) {
      return 1;
    }
    if (a.comment_id > b.comment_id) {
      return -1;
    }
    return 0;
  }

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
      setForums(forumsData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };
 
  const handleClick = async (id) => {
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

  const handleLikeComment = async (id) => {
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
          instance: id,
          role: "likes",
        },
        config
      );

      if (data.data.code === 200) {
        toast.show("Liked successfully");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const handleViewComments = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        `${url}/get-single-post/`,
        {
          instance: id,
        },
        config
      );

      if (data.data.code === 200) {
        console.log("comments", data.data);
      } else {
        console.log("comments", data.data.list);
      }

      setComments(data.data.list);
      setShowComments(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const [comment, setComment] = useState("");
  const [load1, setLoad1] = useState(false);

  const AddComments = async (id) => {
    try {
      setLoad1(true);

      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `https://dev.shiriki.org/api/post-comment/`,
        {
          instance: id,
          comment: comment,
        },
        config
      );

      if (res.data.code === 200) {
        toast.show("comment added");
        setReplyingTo("");
        handleViewComments(id);
      } else {
        toast.show(res.data.status);
      }
    } catch (error) {
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setLoad1(false);
    }
  };

  const addReply = async (commentId, id) => {
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
        setReplyingTo("");
        handleViewComments(id); // Refresh comments to show the new reply
        commentInputRef.current.focus(); // Focus the comment input
      } else {
        toast.show(res.data.status);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <View>
      {item.map((item) => {
        return (
          <View key={item.post_id} className="bg-white" style={styles.container}>
            <View className="flex flex-row items-center mb-3">
              <Ionicons
                style={{ display: "flex", flexDirection: "row" }}
                name="person-circle"
                size={37}
                color="grey"
              />
              <View className="flex flex-col">
                <Text style={{ fontSize: 14, color: "green" }}>
                  @{item.full_name}
                </Text>
                <View className="flex flex-row justify-between w-full pr-8">
                  <Text className="ml-1 text-slate-700" style={{ fontSize: 12 }}>
                    {item.title}
                  </Text>
                  <Text
                    className="ml-1 text-red-700 italic"
                    style={{ fontSize: 12 }}
                  >
                    Posted on: {format(new Date(item.date), "MMMM do, yyyy hh:mm")}
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
                    onPress={() => handleClick(item.post_id)}
                    name="heart-outlined"
                    size={23}
                    color="grey"
                  />
                  <Text style={styles.statCount}>{item?.likes}</Text>
                </View>
                <View style={styles.iconCard}>
                 
                </View>
                <View style={styles.iconCard}>
                  <AntDesign name="eyeo" size={23} color="grey" />
                  <Text style={styles.statCount}>{item?.likes}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() =>
                      navigation.navigate("SingleSocial", {
                        id: item.post_id,
                      })
                    } className="flex flex-row border p-1 rounded-2xl border-slate-200">
              <FontAwesome5   name="comment" size={19} color="grey" />
                  <Text style={styles.statCount}>Add a comment</Text>
              </TouchableOpacity>
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
              {expanded ? item?.description : item?.description.slice(0, 180)}...
              <Text onPress={toggleDescription} className="text-slate-400">
                {expanded ? " Show Less" : (
                  <Text
                    onPress={() =>
                      navigation.navigate("SingleSocial", {
                        id: item.post_id,
                      })
                    }
                  >
                    Read More
                  </Text>
                )}
              </Text>
            </Text>
            {uid === item.post_id && (
              <View>
                <View className="flex gap-3 flex-row">
                  <TextInput
                    className="border mb-1 p-1 w-72 rounded-lg border-slate-200"
                    style={styles.input}
                    placeholder="add your comment"
                    keyboardType="text"
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    multiline
                    ref={commentInputRef}
                  />
                  <Pressable
                    onPress={() => {
                      AddComments(item.post_id);
                      setComment("");
                      setUid("");
                    }}
                    style={styles.button}
                  >
                    <Ionicons size={35} color="green" name="send" />
                  </Pressable>
                </View>
                <View>
                  {comments?.map((comment) => {
                    return (
                      <View key={comment.comment_id}>
                        <View className="flex mr-5 flex-row">
                          <Ionicons1 size={29} name="account-circle" />
                          <View className="flex flex-shrink border border-slate-100 rounded-lg m-1 p-1 bg-slate-100 max-w-full">
                            <View className="flex-shrink border border-slate-100 rounded-lg m-1 p-1 bg-slate-100 max-w-full">
                              <Text className="text-xs text-black font-bold">{comment.user}</Text>
                              <Text className="text-slate-800">{comment.comment}</Text>
                            </View>
                            <View className="flex bg-slate-100 p-1 flex-row">
                              <View style={styles.iconCard}>
                                <Entypo
                                  onPress={() => handleLikeComment(comment.comment_id)}
                                  name="heart-outlined"
                                  size={23}
                                  color="grey"
                                />
                                <Text style={styles.statCount}>{comment.likes}</Text>
                              </View>
                              <Text
                                className="text-slate-500"
                                onPress={() => setReplyingTo(comment.comment_id)}
                              >
                                Reply
                              </Text>
                            </View>

                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            <View className="w-full h-1 bg-slate-300" />
          </View>
        );
      })}
    </View>
  );
}