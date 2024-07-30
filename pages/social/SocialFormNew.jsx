import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";

const SocialFormNew = ({navigation}) => {
  const [post, setPost] = useState("");
  const [subject, setTitle] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageUri1, setImageUri1] = useState("");
  console.log("imageUri1,", imageUri1);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setImageUri1(result.assets[0].uri);
    console.log(result.assets[0].uri);
    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!post || !subject) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const token = "YOUR_USER_TOKEN_HERE"; // Replace with actual token logic

    const formData = new FormData();

    // formData.append("file", imageUri);

    try {
      const config = {
        headers: {
          Authorization: `Token 00e5dd8e3a804d06734b9add9ba85b29b98a336d`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `https://dev.shiriki.org/api/create-post/`,
        {
          post: post,
          subject: subject,
          image: imageUri1,
        },
        config
      );

      if (response.status == 200) {
        Alert.alert("Success", "Post created successfully");
        console.log(response.data);
        navigation.navigate("Social");
        setShowForm(false);
      } else {
        const errorData = await response.statusText;
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <TouchableOpacity>
        <Ionicons name="arrowleft" size={24} />
      </TouchableOpacity>
      <View className="flex flex-col m-4 bg-white gap-5">
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
      </View>
      <View className=" bg-white pt-20 p-3  flex flex-col gap-5">
      <Text style={{
          marginTop:20
        }} className="text-green-600 mt-20  text-lg font-semibold">
          Add Your Post
        </Text>
        <TextInput
          className="border border-slate-200 p-1 rounded-lg"
          style={styles.input}
          onChangeText={(text) => setTitle(text)}
          placeholder="Post title"
        />
        <TextInput
          className="border border-slate-400 p-1 rounded-lg h-32"
          onChangeText={(text) => setPost(text)}
          placeholder="Post content"
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={pickImage}
          className="border  p-2 rounded-lg border-slate-400 text-center"
        >
          <Text className="text-black text-center">Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
                      handleSubmit()
                      navigation.navigate("Social");
                    }} style={styles.button}>
          <Text className="text-white" style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </View>
        <Text>Images</Text>
        <View className="mt-20" style={styles.container}>
          <Text></Text>
          {imageUri1 && (
            <Image source={{ uri: imageUri1 }} style={styles.image} />
          )}
        </View>
    </View>
  );
};

export default SocialFormNew;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        color:"white"
      },
});
