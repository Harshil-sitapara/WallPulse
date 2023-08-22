import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {AllCategoryData} from '../assets/AllCategoryData';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export default function CategoriesImages({route}) {
  const {width, height} = Dimensions.get('window');
  const cardWidth = (width - 20) / 2 - 10;
  const {categoryName} = route.params;
  const selectedCategory = AllCategoryData.find(
    category => category.categoryText === categoryName,
  );
  //
  const navigation = useNavigation();
  const handlepOpenImage = imgUrl => {
    navigation.navigate('OpenImage', {
      imgUrl,
    });
  };
  //

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={styles.mainHero}>
          {selectedCategory &&
            selectedCategory.Images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  handlepOpenImage(image);
                }}>
                <View style={styles.card}>
                  <Image
                    source={{uri: image}}
                    style={{
                      width: cardWidth,
                      height: 280,
                    }}
                    alt="Image"
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navMain: {
    width: Dimensions.width,
    paddingVertical: '2%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  navText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  mainHero: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    paddingTop: '4%',
    backgroundColor: 'white',
  },
  card: {
    width: '49%',
    marginBottom: 20,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
    position: 'relative',
    bottom: '15%',
    color: 'white',
    left: '5%',
  },
});