import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {categoryData} from '../assets/imageData';
import {useNavigation} from '@react-navigation/native';

export default function HomePage() {
  const {width, height} = Dimensions.get('window');
  const cardWidth = (width - 20) / 2 - 10;
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100], // Adjust the range as needed
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  // go to images category page
  const navigation = useNavigation();
  const handleCategoryPage = categoryName => {
    navigation.navigate('CategoryImages', {
      categoryName,
    });
  };
  //

  return (
    <SafeAreaView style={{flex: 1}}>
      <Animated.View
        style={[
          styles.navMain,
          {
            backgroundColor: '#C9DBB2',
            opacity: headerOpacity,
          },
        ]}>
        <Text style={styles.navText}>Wallpapers</Text>
      </Animated.View>
      <ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}>
        <View style={styles.mainHero}>
          {categoryData.map((category, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                handleCategoryPage(category.categoryText);
              }}>
              <View style={styles.card}>
                <Image
                  source={{uri: category.frontImage}}
                  style={{
                    width: cardWidth,
                    height: 280,
                  }}
                  alt="Image"
                />
                <Text style={styles.categoryText}>{category.categoryText}</Text>
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
    marginTop: 50,
    backgroundColor: 'white',
    paddingTop: '4%',
  },
  card: {
    width: '49%',
    marginBottom: 2,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 3,
    position: 'relative',
    bottom: '15%',
    color: 'white',
    left: '4%',
  },
});
