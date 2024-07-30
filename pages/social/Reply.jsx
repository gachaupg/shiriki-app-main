import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
  import axios from "axios";
  import { useToast } from "react-native-toast-notifications";
  import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
  
  const Reply = ({ route, navigation }) => {
    const { id, uid } = route.params;
    const [reply, setReply] = useState("");
    const toast = useToast();
    const { user } = useSelector((state) => state.auth);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post(
          `https://dev.shiriki.org/api/get-single-post/`,
          { instance: id },
          config
        );
        setComments(data.list);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.show("Error fetching comments", { type: "danger" });
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [id]);
  
    const addReply = async () => {
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
          `https://dev.shiriki.org/api/post-comment-reply/`,
          {
            instance: id,
            comment_id: uid,
            comment: reply,
          },
          config
        );
  
        if (res.data.code === 200) {
          toast.show("Reply added");
          setReply("");
          fetchData();
        } else {
          toast.show(res.data.status, { type: "danger" });
        }
      } catch (error) {
        console.error("Error adding reply:", error);
        toast.show("Error adding reply", { type: "danger" });
      }
    };
  
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <View className="mt-2" style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Social")}>
            <AntDesign name="arrowleft" color="grey" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.repliesContainer}>
          <Text style={styles.title}>Replies</Text>
          {comments.map((item1) => (
            <View key={item1.comment_id}>
              {item1.comment_id === uid && (
                <View>
                  {item1.replies.map((item, index) => (
                    <View key={index} style={styles.replyContainer}>
                      <View>
                        <View className="flex gap-1 items-center flex-row">
                          <Ionicons
                            style={{ display: "flex", flexDirection: "row" }}
                            name="person-circle"
                            size={37}
                            color="grey"
                          />
                          <Text>{item.user}</Text>
                        </View>
                        <Text style={styles.replyText}>{item.reply}</Text>
                      </View>
                      <View style={styles.iconsContainer}>
                        <View style={styles.iconCard}>
                          <Entypo name="heart-outlined" size={23} color="grey" />
                          <Text style={styles.statCount}>{item?.likes}</Text>
                          <Text className="ml-5">{formatDistanceToNow(new Date(item.date_created), { addSuffix: true })}</Text>

                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a reply..."
            value={reply}
            onChangeText={setReply}
          />
          <TouchableOpacity onPress={addReply}>
            <Ionicons name="send" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default Reply;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    header: {
      backgroundColor: "white",
      paddingVertical: 10,
      paddingHorizontal: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    repliesContainer: {
      flex: 1,
      padding: 15,
    },
    title: {
      fontWeight: "bold",
      marginBottom: 10,
    },
    replyContainer: {
      alignSelf: "flex-start",
      backgroundColor: "#f0f0f0",
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      maxWidth: "80%",
    },
    replyText: {
      fontSize: 16,
    },
    iconsContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    iconCard: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    },
    statCount: {
      marginLeft: 5,
      color: "grey",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#e0e0e0",
    },
    input: {
      flex: 1,
      backgroundColor: "#f0f0f0",
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginRight: 10,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  