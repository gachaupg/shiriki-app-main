import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons1 from 'react-native-vector-icons/AntDesign';
import Ionicons2 from 'react-native-vector-icons/Ionicons';

const Header = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
       
        {show ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
          />
        ) : (
          <>
           <Image
          style={styles.image}
          source={{ uri: 'https://res.cloudinary.com/pitz/image/upload/v1718005052/logo_2_gzjnjs.png' }}
        />
         <Ionicons1
            onPress={handleShow}
            name="search1"
            size={27}
            style={styles.icon}
          />
          </>
         
        )}
        <Ionicons2
          onPress={handleShow}
          name="person-circle-outline"
          size={35}
          style={styles.icon}
        />
      </View>
    
    </View>
     
    </>
    
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop:10,
    // padding: 10,
    backgroundColor: '#ffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 55,
    width: 180,
    objectFit:"fill"
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'green',
    width: 300,
    height: 30,
    padding: 5,
    borderRadius: 3,
  },
  icon: {
    marginLeft: 20,
  },
});
