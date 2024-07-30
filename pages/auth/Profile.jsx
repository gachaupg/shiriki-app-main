import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons1 from "react-native-vector-icons/AntDesign";
import Ionicons4 from "react-native-vector-icons/Feather";
import RNPickerSelect from "react-native-picker-select";
// import * as ImagePicker from 'expo-image-picker';

import Ionicons2 from "react-native-vector-icons/Feather";
import { useToast } from "react-native-toast-notifications";
import { setLogout } from "../../redux/features/authSlice";
import UserSocialPost from "./UserSocialPost";
import UserReports from "./UserReports";
import UserAlerts from "./UserAlerts";
const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmpassword: "",
  county: "",
  subcounty: "",
  ward: "",
  gender: "",
  age_group: "",
  phone: "",
};
const Profile = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState(user?.user?.first_name);
  const [lastName, setLastName] = useState(user?.user?.last_name);
  const [email, setEmail] = useState(user?.user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.user?.phone_number);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [form, setForm] = useState(initialState);
  const [confirmpassword, setConfirmPassword] = useState("");
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [gender, setGender] = useState([]);
  const [age, setAge] = useState([]);
  const [countyI, setCountyI] = useState("");
  const [subCountyI, setSubCountyI] = useState("");
  const [post, setPost] = useState("Social");
  const [post1, setPost1] = useState("");
  const [post2, setPost2] = useState("");
  const [post3, setPost3] = useState("Social");

  const handleClick = () => {
setPost("Social");
   setPost1("");
setPost2("");
  };
  const handleClick1 = () => {
   setPost("");
    setPost1("Report");
    setPost2("");
  };
  
  const handleClick2 = () => {
setPost("");
setPost1("");
 setPost2("Alert");
  };

  console.log("====================================");
  console.log(form);
  console.log("====================================");
  const filteredCounties = subcounties.filter(
    (county) => county.subcounty_id === countyI
  );
  // console.log(filteredCounties);

  useEffect(() => {
    fetchData();
  }, []);

  const update = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `https://dev.shiriki.org//api/save-profile/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          county: "1",
          subcounty: "3",
          ward: "20",
          gender: "1",
          age_group: "1",
          phone: "0719852400",
        },
        config
      );
      if (res.data.code == 200) {
        toast.show("update sucessfull");

        fetchData();
      }
      console.log("forumsArrayv fetching", res.data);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData1();
  }, []);

  const fetchData1 = async () => {
    try {
      const url = "https://dev.shiriki.org/api/load-sign-up/";
      const token = "fee8da004fbcbd14ddbc18bad38089e3c00ff082";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGender(res.data.gender);
      setAge(res.data.age);
      setCounties(res.data.counties);
      setSubcounties(res.data.subcounties);
      setWards(res.data.wards);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const handleUpdate = () => {
    // Handle update logic here
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [forums, setForums] = useState([]);
  const [user1, setUser1] = useState([]);

  const discussionsArray = forums.map((forum) => forum.discussions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `https://dev.shiriki.org/api/update-profile/`,
        config
      );

      // console.log("user data", res.data);

      setUser1(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching forums:", error);
      setLoading(false);
    }
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };
  const [image, setImage] = useState(null);

  const handleImagePick = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    // if (!result.cancelled) {
    //   setImage(result.uri);
    // }
  };
  return (
    <ScrollView>
      <View className="p-3">
        {showUpdateForm ? (
          <View
            style={{ width: 370 }}
            className="flex  flex-col p-5 justify-center bg-white gap-2 border-slate-300 rounded-lg border-1 border"
          >
            <View className="flex flex-row items-center justify-between ">
              <Ionicons1
                onPress={toggleUpdateForm}
                className="mr-10"
                size={30}
                name="arrowleft"
              />
              <Text
                className="text-red-500"
                style={{ fontSize: 18, marginBottom: 10 }}
              >
                Update Profile:
              </Text>
            </View>
            <View className="bg-slate-200 flex rounded-lg  flex-row items-center justify-between p-1">
              <Ionicons3 className="" size={100} name="account-circle">
                <Ionicons3
                  onPress={handleImagePick}
                  className=""
                  size={20}
                  name="camera"
                />
              </Ionicons3>
            </View>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholder="Phone Number"
            />

            <View
              style={{ width: "97%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) =>
                  setForm({ ...form, age_group: value })
                }
                items={age.map((county) => ({
                  label: county.name,
                  value: county.id,
                }))}
                placeholder={{
                  label: user1?.user?.age_group,
                  value: user1.county,
                }}
              />
            </View>
            <View
              style={{ width: "97%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => setForm({ ...form, gender: value })}
                items={gender.map((county) => ({
                  label: county.name,
                  value: county.id,
                }))}
                placeholder={{ label: user1?.user?.gender, value: null }}
              />
            </View>
            <View
              style={{ width: "97%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => (
                  setForm({ ...form, county: value }), setCountyI(value)
                )}
                items={counties.map((county) => ({
                  label: county.name,
                  value: county.id,
                }))}
                placeholder={{ label: user1?.user?.county, value: null }}
              />
            </View>
            <View
              style={{ width: "97%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => (
                  setForm({ ...form, subcounty: value }), setSubCountyI(value)
                )}
                items={
                  subcounties
                    ? subcounties
                        .filter((gender) => gender.county_id === countyI)
                        .map((gender) => ({
                          label: gender.name,
                          value: gender.county_id,
                        }))
                    : []
                }
                placeholder={{ label: user1?.user?.constituency, value: null }}
              />
            </View>
            <View
              style={{ width: "97%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => setForm({ ...form, ward: value })}
                items={
                  wards
                    ? wards
                        .filter((gender) => gender.subcounty_id === subCountyI)
                        .map((gender) => ({
                          label: gender.name,
                          value: gender.subcounty_id,
                        }))
                    : []
                }
                placeholder={{ label: user1?.user?.ward, value: null }}
              />
            </View>

            <TouchableOpacity
              className="flex text-center items-center bg-green-700 p-2 rounded-lg"
              onPress={update}
            >
              <Text className="text-white">Update</Text>
            </TouchableOpacity>
            {/* <Button title="Update" onPress={handleUpdate} /> */}
          </View>
        ) : (
          <View
            style={{ width: 380 }}
            className="flex flex-col  p-3 mt-96  justify-between bg-white gap-2 border-slate-300 rounded-lg border-1 border"
          >
            <View className="flex flex-row items-center justify-between">
              <Text className="text-green-500 text-xl">Account Details</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setLogout(null));
                  navigation.navigate("Login");
                  toast.show("Logged out!", { position: "top-left" });
                }}
                className=""
              >
                <Ionicons3 name="logout" size={30} />
              </TouchableOpacity>
            </View>
            <View className="">
              <Ionicons3 size={100} name="account-circle" color="grey" />
              <View className="ml-4 mb-4">
                <Text className="flex flex-row gap-2 capitalize font-bold text-2xl  text-slate-700">
                  {user?.user?.first_name} {user?.user?.last_name}
                </Text>
                <Text className="flex flex-row gap-2 text-slate-700">
                  {user?.user?.email}
                </Text>
              </View>

              <View className="mt-8 flex flex-col items-center w-full gap-2">
                <TouchableOpacity
                  onPress={toggleUpdateForm}
                  className="border w-full text-center  flex flex-row gap-1 items-center p-2 justify-center rounded-3xl border-slate-200"
                >
                  <Text>
                    {" "}
                    <Ionicons3 size={20} name="lead-pencil" />
                  </Text>
                  <Text className="text-center flex items-center justify-center">
                    Edit Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Settings");
                    toast.show("Logged out!", { position: "top-left" });
                  }}
                  className="border w-full text-center  flex flex-row gap-3 items-center pb-2  justify-center rounded-3xl border-slate-200"
                >
                  <Text>
                    {" "}
                    <Ionicons4 size={20} name="settings" />
                  </Text>
                  <Text className="text-center flex items-center justify-center">
                    Settings
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginTop: 20,
                }}
                className="flex flex-row items-center justify-between mt-6 gap-5 "
              >
                <TouchableOpacity
                  className="p-2  flex mt-10 items-center justify-center bg-blue-400  rounded-lg  "
                  // onPress={toggleUpdateForm}
                >
                  <Text className="text-white flex items-center justify- justify-between">
                    <Text>Add a Post </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-1 flex items-center justify-center bg-green-700  rounded-lg  "
                  onPress={toggleUpdateForm}
                >
                  <Text className="text-white flex items-center p-1 justify- justify-between">
                    <Text>Featured</Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-1 flex items-center justify-center  rounded-lg  "
                  onPress={toggleUpdateForm}
                >
                  <Text className="text-white flex items-center justify- justify-between">
                    <Ionicons2 size={30} color="black" name="more-horizontal" />{" "}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <View
                  style={{
                    height: 0.6,
                    width: 359,
                  }}
                  className="bg-black mt-3"
                />
                <View className="flex flex-row items-center justify-between mt-3 ">
                  <Text onPress={handleClick} className="text-red-600">
                    Social Posts
                  </Text>
                  <Text onPress={handleClick1} className="text-slate-600">
                    Reports{" "}
                  </Text>
                  <Text onPress={handleClick2} className="text-slate-600">
                    Alerts
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-row justify-between items-end gap-2 capitalize"></View>
            {post == "Social" && <UserSocialPost navigation={navigation} />}
            {post1 == "Report" && <UserReports />}
            {post2 == "Alert" && <UserAlerts navigation={navigation} />}
            <View></View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 15,
    color: "black",
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "green",
    borderRadius: 15,
    color: "black",
    paddingRight: 30,
    marginBottom: 10,
  },
};

export default Profile;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
