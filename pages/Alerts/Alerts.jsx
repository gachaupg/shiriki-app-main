import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import {
  Ionicons,
  Feather,
  Entypo,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Ionicons1 from "react-native-vector-icons/AntDesign";

const { width } = Dimensions.get("window");

const imageUrls = [
  {
    url: "https://res.cloudinary.com/pitz/image/upload/v1716204560/images_hmii4d.png",
    title: "Title 1",
    desc: "Lorem Ipsum is simply dummy text of the printing.",
  },
  {
    url: "https://res.cloudinary.com/pitz/image/upload/v1716204560/images_khvuo2.jpg",
    title: "Title 2",
    desc: "Lorem Ipsum is simply dummy text of the printing.",
  },
  {
    url: "https://res.cloudinary.com/pitz/image/upload/v1716204486/download_ygfy9a.jpg",
    title: "Title 3",
    desc: "Lorem Ipsum is simply dummy text of the printing.",
  },
  {
    url: "https://res.cloudinary.com/pitz/image/upload/v1716204560/images_hmii4d.png",
    title: "Title 4",
    desc: "Lorem Ipsum is simply dummy text of the printing.",
  },
];

const MyCarousel = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const [selectedButton, setSelectedButton] = useState("Latest");
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
      const res = await axios.get(
        `https://dev.shiriki.org/api/get-news`,
        config
      );
      const forumsData = res.data.list;
      console.log("forumsData", forumsData);
      setForums(forumsData);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  const [CouselData, setCouselData] = useState([]);

  useEffect(() => {
    fetchData1();
  }, [user]);

  const fetchData1 = async () => {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `https://dev.shiriki.org/api/get-news`,
        config
      );
      const forumsData = res.data.list;
      console.log("forumsData", forumsData);
      setCouselData(forumsData);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Carousel Section */}
      <View style={styles.carouselContainer}>
        <View className="flex  flex-row justify-between">
          <Text style={styles.title}>Featured Alerts</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AlertForm")}>
            <Text>
              <Ionicons1 name="pluscircle" size={24} />
            </Text>
          </TouchableOpacity>
        </View>
        <Carousel
        onPress={() =>
          navigation.navigate("SingleAlert", {
            id: data.post_id,
            
          })
        }
          width={width - 20}
          height={width / 2}
          autoPlay
          autoPlayInterval={2000}
          data={CouselData}
          onSnapToItem={setActiveSlide}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image
                style={styles.image}
                source={{ uri: "https://res.cloudinary.com/pitz/image/upload/v1718116589/download_4_p65s20.jpg" }}
                resizeMode="cover"
              />
              <View style={styles.imageTitle} className="flex flex-row">
              <Text style={styles.imageTitle}>{item.title}</Text>
              <Text style={styles.imageTitle1}  onPress={() =>
          navigation.navigate("SingleAlert", {
            id: item.post_id,
            
          })
        } >Read More..</Text>
              </View>
            </View>
          )}
        />
        <View style={styles.paginationContainer}>
          {imageUrls.map((_, index) => (
            <PaginationDot
              key={index}
              index={index}
              activeSlide={activeSlide}
            />
          ))}
        </View>
      </View>

      {/* Alert Section */}
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>Alerts for You</Text>
        {forums.map((data, index) => (
          <View key={index} className='border rounded-lg border-slate-300 mb-4'>
            <Image
            className="rounded-t-lg"
             width='100%'
             height={200}
              source={{
                uri: "https://res.cloudinary.com/pitz/image/upload/v1718116589/download_4_p65s20.jpg",
              }}
              resizeMode="cover"
            />
            <View style={styles.alertTextContainer}>
              <View  className="flex flex-row ">
                {/* <ico */}
                <Ionicons
            style={{ display: "flex", flexDirection: "row" }}
            name="person-circle"
            size={37}
            color="grey"
          />
             <View className="flex flex-col">
             <Text style={styles.alertTitleText}>{data.title}</Text>
            <View className="flex flex-row items-center justify-between w-full pr-10">
            <Text >{data.full_name}</Text>
              <Text style={styles.postedDate}>Posted:{format(new Date(data.date_created), "MMMM do, yyyy hh:mm")}</Text>
            </View>


             </View>
              </View>
              <Text
                style={{
                  letterSpacing: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  textAlign: "justify",
                  marginTop: 10,
                  marginBottom: 10,
                  fontFamily: "Helvetica Neue",
                  lineHeight: 20, // Adjust line spacing as needed
                }}
              >
                {data.description.slice(0, 35)}
                <Text  onPress={() =>
              navigation.navigate("SingleAlert", {
                id: data.post_id,
                
              })
            } style={styles.readMore}> Read More</Text>
              </Text>
            </View>
            {/* Modal for Form Submission */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="" style={styles.modalOverlay}>
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
                      className="m-5 bg-green-600 p-2 w-full rounded rounded-xm"
                      onPress={handleFormSubmit}
                    >
                      <Text className="text-center text-white">Submit</Text>
                    </TouchableOpacity>
                    <Button
                      className="mt-1"
                      title="Cancel"
                      onPress={() => setModalVisible(false)}
                    />
                    <View className="mt-20  h-64" style={styles.container}>
                      <Text></Text>
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
            </Modal>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const PaginationDot = ({ index, activeSlide }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        activeSlide,
        [index - 1, index, index + 1],
        [0.3, 1, 0.3]
      ),
      transform: [
        {
          scale: interpolate(
            activeSlide,
            [index - 1, index, index + 1],
            [0.8, 1.2, 0.8]
          ),
        },
      ],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#edf2f7",
    // paddingHorizontal: 10,
    paddingTop: 20,
  },
  carouselContainer: {
    // backgroundColor: "#f0f4f7",
    // borderRadius: 15,
    // marginBottom: 20,
    // // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  title: {
    color: "green",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 20,
    // textAlign: "center",
  },
  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  imageTitle1: {
    position: "absolute",
    bottom: 10,
    left: 250,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 16,
  },
  imageTitle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: "#2c5282",
    opacity: 0.6,
  },
  alertContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  alertTitle: {
    color: "#2c5282",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    // textAlign: "center",
  },
  alertCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d2d6dc",
    borderRadius: 15,
    marginBottom: 10,
    overflow: "hidden",
  },
  alertImage: {
    width: "45%",
    height: 120, // Adjusted height for consistency
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  alertTextContainer: {
    flex: 1,
    padding: 10,
  },
  alertTitleText: {
    fontWeight: "bold",
    color: "#2c5282",
    fontSize: 16,
  },
  alertDesc: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 5,
  },
  readMore: {
    color: "#6b7280",
  },
  postedDate: {
    color: "#dc2626",
    fontStyle: "italic",
    marginTop: 5,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
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
});

export default MyCarousel;
