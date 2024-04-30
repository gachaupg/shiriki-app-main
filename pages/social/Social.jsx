import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/FontAwesome";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons2 from "react-native-vector-icons/Feather";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons4 from "react-native-vector-icons/Entypo";
import Ionicons5 from "react-native-vector-icons/Ionicons";

const data = [
  { key: "Latest", title: "News" },
  { key: "Trending", title: "Trending" },
  { key: "Technology", title: "Technology" },
  { key: "Social Media", title: "Social Media" },
  { key: "Jobs", title: "Jobs" },
  { key: "Society", title: "Society" },
];

const blogs = [
  {
    id: 1,
    title: "Social media influence",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, recusandae.",
    image:
      "https://www.searchenginejournal.com/wp-content/uploads/2021/09/16-reasons-why-social-media-is-important-to-your-company-616d3200e6dc6-sej.png",
  },
  {
    id: 1,
    title: "Politics Debate",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, recusandae.",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    id: 1,
    title: "Dollar to shilling drop",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, recusandae.",
    image:
      "https://www.theeastafrican.co.ke/resource/blob/4367498/bb9f3be1fdca3318344ebdb4d5f936ec/shillingke-data.jpg",
  },
];

const Alerts = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState("Latest");

  const renderItem = ({ item }) => (
    <Pressable
      style={{
        padding: 5,
        backgroundColor: selectedButton === item.key ? "green" : "lightgray",
        margin: 5,
        borderRadius: 5,
      }}
      onPress={() => setSelectedButton(item.key)}
    >
      <Text style={{ color: selectedButton === item.key ? "white" : "black" }}>
        {item.title}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView className="bg-white" style={{ padding: 15, paddingTop: 25 }}>
      <Text style={{ color: "red", fontSize: 27, fontWeight: "600" }}>
        Stay connect with Shiriki
      </Text>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item) => item.key}
        />
      </View>
      <View style={{ marginTop: 20, borderColor: "grey" }}>
        {blogs.map((blog, index) => (
          <>
            <TouchableOpacity key={index} style={styles.blogContainer}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  marginBottom: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login", { id: forum.id })}
                  style={styles.profile}
                >
                  <Ionicons5 name="person" size={30} color="green" />
                </TouchableOpacity>
                <Text>@username</Text>
                <Text>18hrs ago</Text>
              </View>
              <Text style={{ fontSize: 12, marginBottom: 12 }}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Corporis ad nobis, reiciendis dolore corrupti consectetur!
              </Text>
              <Image style={styles.image} source={{ uri: blog.image }} />

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              ></View>
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 40,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              <View>
                <Icon name="like2" size={15} color="grey" />
                <Text style={{ color: "grey", fontSize: 12 }}>200</Text>
              </View>
              <View>
                <Icon name="dislike2" size={15} color="grey" />
                <Text style={{ color: "grey", fontSize: 12 }}>0</Text>
              </View>
              <View style={{ display: "flex" }}>
                <Ionicons3
                  name="comment-processing-outline"
                  size={15}
                  color="grey"
                />
                <Text style={{ color: "grey", fontSize: 12 }}>10</Text>
              </View>

              <Ionicons name="share" size={15} color="grey" />
            </View>
          </>
        ))}
      </View>
    </ScrollView>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  blogContainer: {
    padding: 10,
    borderColor: "grey",
    borderWidth: 0.1, // Adjust the thickness of the border as needed
    borderStyle: "solid", // Specify the style of the border
    marginBottom: 10,
    borderRadius: 2,
  },

  image: {
    height: 230,
    width: "100%",
    objectFit: "cover",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: "#800",
    fontWeight: "600",
  },
  profile: {
    height: 40,
    width: 40,
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
