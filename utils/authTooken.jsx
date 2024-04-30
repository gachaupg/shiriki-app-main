import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const authTooken = () => {
    
    const dispatch = useDispatch();

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const users = await AsyncStorage.getItem("profile");
        if (users) {
          const parsedUser = JSON.parse(users);
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error("Error reading user from AsyncStorage:", error);
      }
    };

    getUserFromStorage();
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);

useEffect(() => {
  if (user) {
    navigation.navigate("Home"); // Navigate to Home screen if user is truthy
  } else {
    navigation.navigate("Login"); // Navigate to Login screen if user is falsy
  }
}, [user]); 
  return (
    <div>authTooken</div>
  )
}

export default authTooken