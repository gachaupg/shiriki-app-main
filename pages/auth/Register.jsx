import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/features/authSlice";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmpassword: "",
  // county: "",
  // subcounty: "",
  // ward: "",
  // gender: "",
  // age_group: "",
  phone: "",
};

const Register = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  const [confirmpassword, setConfirmPassword] = useState("");
  // const [counties, setCounties] = useState([]);
  // const [subcounties, setSubcounties] = useState([]);
  // const [wards, setWards] = useState([]);
  // const [gender,setGender]=useState([]);
  // const [age,setAge]=useState([]);
  // const [countyI,setCountyI]=useState('')
  // const [subCountyI,setSubCountyI]=useState('')
console.log('====================================');
console.log(form);
console.log('====================================');
  // const filteredCounties = subcounties.filter(county => county.subcounty_id === countyI);
  // console.log(filteredCounties);

  // useEffect(() => {
  //   fetchData();
    
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const url = "https://dev.shiriki.org/api/load-sign-up/";
  //     const token = "fee8da004fbcbd14ddbc18bad38089e3c00ff082";
  //     const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  //     setGender(res.data.gender);
  //     setAge(res.data.age);
  //     setCounties(res.data.counties);
  //     setSubcounties(res.data.subcounties);
  //     setWards(res.data.wards);
  //   } catch (error) {
  //     console.log("Error fetching data:", error);
  //   }
  // };
// console.log('frm,c',subCountyI);
  const handleSubmit = () => {
    if (form.password !== confirmpassword) {
      toast.show("Passwords do not match");
      return;
    }
    if (form.email) {
      try {
        dispatch(register({ user: form, navigate: navigation.navigate, toast }));
      } catch (error) {
        console.error('Error occurred during registration dispatch:', error);
      }
    }
  };

  return (
    <ScrollView className="mt-16">
    <View style={styles.login}>
    <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://shiriki.org/static/logo.png" }}
            style={styles.logo}
          />
        </View>
      
          <Text style={styles.title1}>USIKIKE!</Text>
          <Text style={styles.p}>Transfering Governance with your input</Text>
          <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(text) => setForm({ ...form, first_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(text) => setForm({ ...form, last_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          onChangeText={(text) => setForm({ ...form, phone: text })}
        />
        {/* <View
              style={{ width: "80%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
              <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => (
            setForm({ ...form, gender: value })
           
          )}
          items={gender.map((county) => ({ label: county.name, value: county.id }))}
          placeholder={{ label: "Select Gender", value: null }}
        />
            </View>  */}
            {/* <View
              style={{ width: "80%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            ><RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setForm({ ...form, age_group: value })}
          items={age.map((county) => ({ label: county.name, value: county.id }))}

          placeholder={{ label: "Select Age Group", value: null }}
        />

            </View> */}
            {/* <View
              style={{ width: "80%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
             <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => (setForm({ ...form, county: value }),
          setCountyI(value))}
          items={counties.map((county) => ({ label: county.name, value: county.id }))}
          placeholder={{ label: "Select County", value: null }}
        /> 
            </View>
            <View
              style={{ width: "80%" }}
              className="h-10 border w-72 border-green-700 rounded-lg"
            >
               <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => (
            setForm({ ...form, subcounty: value }),
            setSubCountyI(value)
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
          }          placeholder={{ label: "Select Subcounty", value: null }}
        /> 
            </View> */}
            {/* <View
              style={{ width: "80%" }}
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
          }                   placeholder={{ label: "Select Ward", value: null }}
        />
        </View> */}
       
           
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setForm({ ...form, password: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <View className='rounded-lg' style={styles.buttonContainer}>
          <Button color='green' title={loading ? "Registering..." : "Register"} onPress={handleSubmit} />
        </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 7 }}>
        <Text> Don't have an account?</Text>
       
        <Text onPress={() => navigation.navigate('Login')} style={{ color: 'red', fontSize: 25 }}>Login to your account</Text>
      </View>
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



export default Register;


const styles = StyleSheet.create({
  login: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 110,
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
});
