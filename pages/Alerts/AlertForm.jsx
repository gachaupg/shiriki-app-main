import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';

const AlertForm = ({navigation}) => {
    const dispatch = useDispatch();
    const [user1, setUser1] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
  
    const [modalVisible, setModalVisible] = useState(false);
    const [subject, setSubject] = useState("");
    const [post, setNews] = useState("");
   console.log(modalVisible);
    const [imageUri, setImageUri] = useState("");
    const [imageUri1, setImageUri1] = useState("");
    // console.log("imageUri1,", imageUri1);
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
  
    const handleFormSubmit = async () => {
        try {
          const token = user.token;
          const config = {
            headers: {
              Authorization: `Token ${user.token}`,
              "Content-Type": "application/json",
            },
          };
          const res = await axios.post(
            `https://dev.shiriki.org/api/create-news/`,
            { subject, post, image: imageUri1 },
            config
          );
          console.log("Form submitted successfully:", res.data);
          setModalVisible(false);
          fetch()
          navigation.navigate('Alerts')
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };
  return (
    <View className="pt-5">
       
     
      <TouchableOpacity >
        {/* <Ionicons name="arrowleft" size={24} /> */}
      </TouchableOpacity>
      <View className="flex flex-col  p-2 bg-white gap-5">
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
              <TouchableOpacity onPress={() => navigation.navigate("Alerts")}>
                <Icon name="arrowleft" color="grey" size={30} />
              </TouchableOpacity>
            </Text>
          </View>
          </View>
          </View>
          <View className="p-3 bg-white pt-20 " style={styles.modalOverlay}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>News Alert</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Subject"
                    value={subject}
                    onChangeText={setSubject}
                  />
                  <TextInput
                    className="h-32 border mb-4 border-slate-200 p-2 rounded-lg"
                    // style={styles.input}
                    placeholder="News"
                    value={post}
                    onChangeText={setNews}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={pickImage}
                    className="border mb-4  p-2 rounded-lg border-slate-400 text-center"
                  >
                    <Text className="text-black text-center">
                      Pick an Image
                    </Text>
                  </TouchableOpacity>
                  <View className="flex flex-col gap-2 ">
                    <TouchableOpacity
                      className=" bg-green-600 p-2   rounded rounded-xm"
                      onPress={handleFormSubmit}
                    >
                      <Text className="text-center text-white">Submit</Text>
                    </TouchableOpacity>
                    {/* <Button
                      className="mt-1"
                      title="Cancel"
                      onPress={() => setModalVisible(false)}
                    /> */}
                    <View className="mt-20  h-64" style={styles.container}>
                      <Text>Imges</Text>
                      {imageUri1===""?<Text>No image picked</Text>:<Text></Text>}
                      {imageUri1 && (
                        <Image
                          source={{ uri: imageUri1 }}
                          style={styles.image}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
    </View>
  )
}

export default AlertForm

const styles = StyleSheet.create({
    
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c5282",
        marginBottom: 10,
      },
      input: {
        height: 40,
        borderColor: "#d2d6dc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
      },
      image: {
        width: 100,
        height: 100,
        marginTop: 10,
      },
})