import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Ionicons1 from "react-native-vector-icons/AntDesign";
import Ionicons2 from "react-native-vector-icons/EvilIcons";
import { useToast } from "react-native-toast-notifications";

const UserSocialPost = ({ navigation }) => {
  const toast = useToast();

  const { user } = useSelector((state) => state.auth);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      const res = await axios.get(
        `https://dev.shiriki.org/api/get-posts/`,
        config
      );
      const forumsData = res.data.list;
      const filteredForums = forumsData.filter(
        (forum) => forum.email === user.user.email
      );
      console.log("filteredForums", filteredForums);
      setForums(filteredForums);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const token = user.token;
      if (!token) {
        console.log("No token found");
        toast.show("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Token ${token}`, // Check if 'Token' is the correct prefix
          "Content-Type": "application/json",
        },
      };

      const res = await axios.delete(
        `https://dev.shiriki.org/api/delete-post/`,
        {
          instance: id,
        }, // Correct placement of the payload
        config
      );

      toast.show("Deleted successfully");
      console.log(res.data);
      // fetchData(); // Refresh the forums after deletion
    } catch (error) {
      console.log("Error deleting forum:", error);
      toast.show("Error deleting post");
    }
  };

  return (
    <View className="flex flex-row flex-wrap gap-3 items-center justify-center pt-3">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : forums.length === 0 ? (
        <Text>No Posts</Text>
      ) : (
        forums.map((forum, index) => (
          <View key={index} className="relative">
            <Image
              source={{
                uri: "https://res.cloudinary.com/pitz/image/upload/v1718116589/download_4_p65s20.jpg",
              }}
              height={100}
              width={100}
            />
            <View className="absolute flex flex-row justify-between">
              <Text className="text-black bg-slate-200 p-1 ">
                {forum.title.slice(0, 10)}
              </Text>
            </View>
            <View className="absolute top-20 left-20 flex flex-row justify-between">
              <Ionicons1
                onPress={() => handleDelete(forum.post_id)}
                className="ml-3"
                name="delete"
                color="red"
              />
            </View>
            <View className="absolute top-20 flex flex-row justify-between">
              <Ionicons2
                onPress={() =>
                  navigation.navigate("UpdateAlert", { data: forum })
                }
                size={26}
                className="ml-3"
                name="pencil"
                color="white"
              />
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default UserSocialPost;

const styles = StyleSheet.create({});
