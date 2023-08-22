import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob'; //to save image
import {setWallpaper, TYPE_SCREEN} from 'rn-wallpapers';
import Modal from 'react-native-modal';
//icons
import HomeIcon from '../assets/homeoutline.png';
import LockIcon from '../assets/lockoutline.png';
import PhoneIcon from '../assets/phoneoutline.jpg';

export default function OpenImage({route}) {
  const navigation = useNavigation();
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [controlsAnim] = useState(new Animated.Value(1));
  //state for wallpaper permissions
  const [isModalVisible, setModalVisible] = useState(false);
  const imgUrl = route.params.imgUrl;
  const wallpaperTypes = [
    {type: 'lock', msg: 'Wallpaper set as lock screen!', icon: LockIcon},
    {type: 'home', msg: 'Wallpaper set as home screen!', icon: HomeIcon},
    {type: 'both', msg: 'Wallpaper set as both screen!', icon: PhoneIcon},
  ];
  const handleShowControls = () => {
    Animated.timing(controlsAnim, {
      toValue: buttonsVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setButtonsVisible(!buttonsVisible);
  };

  const handleSetWallpaper = async wallpaperType => {
    try {
      if (wallpaperType === 'lock') {
        await setWallpaper(
          {
            uri: imgUrl,
            headers: {},
          },
          TYPE_SCREEN.LOCK,
        );
      } else if (wallpaperType === 'home') {
        await setWallpaper(
          {
            uri: imgUrl,
            headers: {},
          },
          TYPE_SCREEN.HOME,
        );
      } else if (wallpaperType === 'both') {
        await setWallpaper(
          {
            uri: imgUrl,
            headers: {},
          },
          TYPE_SCREEN.BOTH,
        );
      }
    } catch (error) {
      console.error('Error setting wallpaper:', error);
    }
  };
  //handle save wallpaper
  const requestSavePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'WallPulse App Storage Permission',
          message:
            'WallPulse App needs access to your storage ' +
            'so you can download pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        saveImage();
      } else {
        console.log('storge permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  //
  const saveImage = () => {
    const {config, fs} = RNFetchBlob;
    const fileDir = fs.dirs.PictureDir;
    const date = new Date();
    const uniqueTimestamp =
      date.getFullYear() +
      (date.getMonth() + 1) +
      date.getDate() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds();
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fileDir + '/download+' + '/wallpulse_' + uniqueTimestamp + '.png',
        description: 'File download',
      },
    })
      .fetch('GET', imgUrl, {})
      .then(res => {
        console.log('The file saved to ', res.path());
        alert('wallpaper downloaded!');
      });
  };
  return (
    <>
      <View style={styles.mainView}>
        {buttonsVisible ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: 'https://banner2.cleanpng.com/20181130/qfv/kisspng-arrow-computer-icons-scalable-vector-graphics-imag-zwettler-brauerei-radmarathon-zwettl-austria-n-5c0142ba93b027.5397929915435864906049.jpg',
              }}
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
        ) : (
          ''
        )}

        <TouchableOpacity
          style={styles.imageTouchable}
          onPress={() => handleShowControls()}
          activeOpacity={0.99}>
          <Image source={{uri: imgUrl}} style={styles.image} />
        </TouchableOpacity>
        {buttonsVisible ? (
          <Animated.View style={[styles.controlMain, {opacity: controlsAnim}]}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                requestSavePermission();
              }}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* set wallpaper btn */}
            <TouchableOpacity
              style={styles.wallpaperButton}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={[styles.buttonText, {color: 'black'}]}>
                Set as Wallpaper
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          ''
        )}
      </View>
      {/* Modal for wallpaper(lock,home or both) */}
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.7}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Wallpaper Type</Text>
          {wallpaperTypes.map(vals => (
            <TouchableOpacity
              key={vals.type}
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                handleSetWallpaper(vals.type);
                ToastAndroid.show(vals.msg, ToastAndroid.SHORT);
              }}>
              <View style={styles.iconContainer}>
                <Image source={vals.icon} style={styles.iconImage} />
                <Text style={{color: 'black',fontSize:15,paddingLeft:4,paddingTop:2}}>{vals.type} screen</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: 'black',
    position: 'relative',
  },
  image: {
    height: '99%',
    width: '99%',
    zIndex: -1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 2,
    padding: 0,
  },
  controlMain: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '99%',
    height: '13%',
    position: 'absolute',
    bottom: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  imageTouchable: {
    flex: 1,
    height: '99%',
    width: '99%',
    zIndex: -1,
  },
  saveButton: {
    position: 'absolute',
    bottom: '37%',
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  wallpaperButton: {
    position: 'absolute',
    bottom: '37%',
    right: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'lightblue',
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // modal style
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  iconContainer: {
    marginRight: 10,
    display:"flex",
    flexDirection:"row",
    textAlign:"center"
  },
  iconImage: {
    width: 27, 
    height: 27,
  },
});
