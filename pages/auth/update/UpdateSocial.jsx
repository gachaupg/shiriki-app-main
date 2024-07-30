import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const UpdateSocial = () => {
  const initialState = {
    title: "",
    description: "",
  };
  const route = useRoute();
  const navigation = useNavigation();
  const { data } = route.params;
  const [form, setForm] = useState({
    title: data.title,
    description: data.description,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://dev.shiriki.org/api/update-posts/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instance: data.post_id,
            subject: form.title,
            post: form.description,
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        // Handle successful update, e.g., navigate back or show a success message
        navigation.navigate("Home");
      } else {
        // Handle error, e.g., show error message
        console.error("Failed to update post:", result);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrowleft" color="grey" size={30} />
        </TouchableOpacity>
      </View>
      <View className="pt-20" style={styles.content}>
        <Text>Update social post</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />
          <TextInput
            style={styles.input}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Submitting" : "Update"}
              color="green"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginTop: 20,
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default UpdateSocial;
