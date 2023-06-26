import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useContext, useState, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../navigation/AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import NotificationForm from '../components/NotificationForm';
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';
const NotificationScreen = ({navigation}) => {
  const [noread, setnoread] = useState([]);
  const [read, setread] = useState([]);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const getNotification = async () => {
    firestore()
      .collection('Notification')
      .orderBy('time', 'desc')
      .get()
      .then(querySnapshot => {
        let listNo = [];
        let listYes = [];
        querySnapshot.forEach(doc => {
          const {
            PostownerId,
            Read,
            classify,
            guestId,
            guestImg,
            guestName,
            postid,
            text,
            time,
          } = doc.data();
          var Time =
            new Date(time._seconds * 1000).toDateString() +
            ' at ' +
            new Date(time._seconds * 1000).toLocaleTimeString();
          if (PostownerId == auth().currentUser.uid) {
            if (Read == 'no') {
              listNo.push({
                Messid: doc.id,
                GName: guestName,
                GId: guestId,
                GImg: guestImg,
                Class: classify,
                PostId: postid,
                Mess: text,
                Time: Time,
              });
            } else {
              listYes.push({
                Messid: doc.id,
                GName: guestName,
                GId: guestId,
                GImg: guestImg,
                Class: classify,
                PostId: postid,
                Mess: text,
                Time: Time,
              });
            }
          }
        });
        setnoread(listNo);
        setread(listYes);
        //console.log("thay");
        setMark();
      });
  };
  useEffect(() => {
    getNotification();
  }, []);
  const setMark = async () => {
    // console.log(noread.length);
    // if (noread.length > 0)
    //   for (let i = 0; i < noread.length; i++) {
    //     firestore()
    //       .collection('Notification')
    //       .doc(noread[i].Messid)
    //       .update({
    //         Read: 'yes',
    //       })
    //       .then(() => {})
    //       .catch(error => {
    //         console.log('Error deleting comment: ', error);
    //       });
    //   }

    const collectionRef = firestore().collection('Notification');
    const query = collectionRef
      .where('Read', '==', 'no')
      .where('PostownerId', '==', auth().currentUser.uid);

    try {
      const snapshot = await query.get();

      if (!snapshot.empty) {
        snapshot.forEach(async doc => {
          const documentRef = collectionRef.doc(doc.id);
          await documentRef.update({
            Read: 'yes', // Thay 'truong_cap_nhat' và 'gia_tri_cap_nhat' bằng trường và giá trị cần cập nhật
          });
        });

        console.log('Cập nhật thành công');
      } else {
        console.log('Không tìm thấy dữ liệu phù hợp');
      }
    } catch (error) {
      console.log('Lỗi khi cập nhật dữ liệu:', error);
    }
  };
  const Action = item => {
    if (item.Class == 'Follow') {
      navigation.push('profileScreen', {userId: item.GId});
    } else {
      navigation.push('gotoPost', {postid: item.PostId});
    }
  };
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme === 'light' ? '#fff' : '#000'},
      ]}>
      <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            name={'arrow-left'}
            style={{
              color: theme === 'light' ? '#000' : '#fff',
              fontSize: 30,
              padding: 5,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            flex: 1,
            marginLeft: 5,
            color: theme === 'light' ? '#000' : '#fff',
          }}>
          {language === 'vn' ? 'Thông báo' : 'Notifications'}
        </Text>
      </View>
      <View style={{height: 1, backgroundColor: '#999999'}} />
      <ScrollView>
        {noread.length != 0 ? (
          <>
            <Text
              style={[
                styles.headertext,
                {color: theme === 'light' ? '#000' : '#fff'},
              ]}>
              {language === 'vn' ? 'Thông báo mới: ' : 'New Notifications'}
            </Text>
            <FlatList
              data={noread}
              renderItem={({item, index}) => (
                <NotificationForm
                  item={item}
                  action={() => {
                    Action(item);
                  }}
                  Remove={() => {
                    const filteredData = noread.filter(
                      i => i.Messid !== item.Messid,
                    );
                    setnoread(filteredData);
                    firestore()
                      .collection('Notification')
                      .doc(item.Messid)
                      .delete();
                  }}
                />
              )}
            />
          </>
        ) : null}
        {read.length != 0 ? (
          <>
            <Text
              style={[
                styles.headertext,
                {color: theme === 'light' ? '#000' : '#fff'},
              ]}>
              {language === 'vn' ? 'Thông báo đã đọc: ' : 'Read Notifications'}
            </Text>
            <FlatList
              data={read}
              renderItem={({item, index}) => (
                <NotificationForm
                  item={item}
                  action={() => {
                    Action(item);
                  }}
                  Remove={() => {
                    const filteredData = read.filter(
                      i => i.Messid !== item.Messid,
                    );
                    setread(filteredData);
                    firestore()
                      .collection('Notification')
                      .doc(item.Messid)
                      .delete();
                  }}
                />
              )}
            />
          </>
        ) : null}
      </ScrollView>
      <View style={{backgroundColor: '#FFCC00', height: 1, marginTop: 10}} />
    </View>
  );
};
export default NotificationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headertext: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: '600',
  },
});
