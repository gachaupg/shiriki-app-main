import React, { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/features/authSlice";
import { useToast } from "react-native-toast-notifications";
import PhoneInput from "react-phone-number-input/react-native-input";

import PhoneNumber from "libphonenumber-js";
const initialState = {
  name: "",
  email: "",
  password: "",
};

const Reports = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  console.log(form);
  const handleSubmit = () => {
    if (form.name && form.email && form.password) {
      dispatch(register({ user: form, navigate: navigation.navigate, toast }));
    } else {
      // Handle form validation errors here
      toast.show("Please fill in all the fields");
    }
  };
  const [value, setValue] = useState();
  const [active, setActive] = useState(true);
  const [active1, setActive1] = useState(false);

  const handleChange = () => {
    if (!active) {
      setActive(true);
      setActive1(false);
    }
  };

  const handleChange1 = () => {
    if (!active1) {
      setActive(false);
      setActive1(true);
    }
  };

  return (
    <ScrollView>
    <View style={styles.login}>
      <View>
        <View style={styles.form}>
          <Text style={{ color: "red", fontSize: 16, marginTop: 15 }}>
            Report an issue
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            keyboardType="text"
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="email"
            keyboardType="email-address"
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <PhoneInput
            style={styles.input}
            placeholder="Subject"
            value={value}
            onChange={setValue}
          />
         <TextInput
        style={styles.textArea}
        placeholder="Issue to report"
        editable
        multiline
        numberOfLines={12}
      />
          <View style={styles.buttonContainer}>
            <Button
              title={"Report an issue"}
              color="green"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>

      <View style={styles.forumHeader}>
        <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
          <Button
            onPress={handleChange}
            color={active ? "red" : "grey"}
            style={{ borderRadius: 20 }}
            title=" Active Reports"
          />
        </View>
        <View style={{ backgroundColor: "grey", borderRadius: 25 }}>
          <Button
            onPress={handleChange1}
            color={active1 ? "red" : "grey"}
            style={{ borderRadius: 20 }}
            title=" Past Reports"
          />
        </View>
       
      </View>
      <View style={{paddingLeft:12,paddingRight:12}}>
          <TouchableOpacity
            // onPress={() => navigation.navigate("SingleForum")}
            style={styles.card}
          >
            <Text style={{ color: "red", fontSize: 15, fontWeight: "500" }}>
              Subject
            </Text>
            <Text style={{ marginTop: 13 }}>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              velit ipsam dicta odit alias maiores perferendis aliquam natus ad
              eius dolores rem obcaecati accusantium sed, quod voluptatum
              corrupti officia molestias saepe maxime incidunt. Quae, officia.
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text> @peter</Text>
              <Text style={{color:'red'}}>read more</Text>
              <Text style={{ color: "green" }}> Date: 12:12:2014</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{paddingLeft:12,paddingRight:12,marginBottom:20}}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SingleForum")}
            style={styles.card}
          >
            <Text style={{ color: "red", fontSize: 15, fontWeight: "500" }}>
              Subject
            </Text>
            <Text style={{ marginTop: 13 }}>
              {" "}
              Lorem ipsum dolor sit abet consectetur adipisicing elit. Similique
              velit ipsam dicta odit alias maiores perferendis aliquam natus ad
              eius dolores rem obcaecati accusantium sed, quod voluptatum
              corrupti officia molestias saepe maxime incidunt. Quae, officia.
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text> @peter</Text>
              <Text style={{color:'red'}}>read more</Text>
              <Text style={{ color: "green" }}> Date: 12:12:2014</Text>
            </View>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  login: {
    display: "flex",
    marginTop: 10,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
  },
  forumHeader: {
    height: 38.2,
    width: "100%",
    // borderColor: "grey",
    // borderWidth: 1,
    marginLeft: 35,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    padding: 3,
    gap: 20,
    marginTop: 20,
  },
  form: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "green",
    fontWeight: "800",
    textAlign: "center",
  },
  p: {
    fontFamily: "Qwitcher Grypen",
    fontWeight: "400",
    fontStyle: "italic",
    textAlign: "center",
  },
  title1: {
    fontSize: 65,
    color: "red",
    fontWeight: "800",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 6,
    width: "80%",
    marginTop: 15,
  },
  card: {
    marginTop: 17,
    width: "100%",
    backgroundColor: "white",
    height: 200,
    borderRadius: 6,
    padding: 6,
    // Android
    elevation: 5, // Adjust the elevation value for desired shadow effect
    // iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  textArea: {
    width: "80%",
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    padding: 10,
    textAlignVertical: 'top', // This will make the text start from the top
    height: 100, // You can adjust the height as per your requirement
  },
  cardBody: {
    color: "white",
    marginTop: "108%",
  },
  icon: {
    marginLeft: "75%",
  },
});
