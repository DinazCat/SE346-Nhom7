import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const getFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        firestore().collection('users').doc(auth().currentUser.uid).set({
          token: token
      }, { merge: true });

      } catch (error) {
        console.log('Error retrieving FCM token:', error);
      }
    };
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          login: async (email, password) => {
            try {
              await auth().signInWithEmailAndPassword(email, password);
              getFcmToken();
            } catch (e) {
              console.log(e);
              alert(e);
            }
          },
          forgotPassword: async(email) => {
            await auth().sendPasswordResetEmail(email)
            .then(() => {
              alert('Password reset email sent, please check your email!');
            }).catch((e) => {
              alert(e);
            })
          },
          googleLogin: async () => {
            try{
              // Get the users ID token
              const { idToken } = await GoogleSignin.signIn();
              // Create a Google credential with the token
              const googleCredential = auth.GoogleAuthProvider.credential(idToken);
              // Sign-in the user with the credential
              await auth().signInWithCredential(googleCredential)
              getFcmToken();
              await auth().signInWithCredential(googleCredential)
              .then(() => {
                firestore().collection('users').doc(auth().currentUser.uid)
                .set({
                    id: auth().currentUser.uid,
                    name: auth().currentUser.displayName,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    about: '',
                    followers: [],
                    following: [],
                })
                .catch(error => {
                    console.log('Something went wrong with added user to firestore: ', error);
                })
              })
              .catch(error => {
                console.log('Something went wrong with gg login: ', error);
                alert(e);
              });
            } catch(error) {
              console.log({error});
              alert(e);
            }
          },
          fbLogin: async () => {
            try {
              // Attempt login with permissions
              const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

              if (result.isCancelled) {
                throw 'User cancelled the login process';
              }
              // Once signed in, get the users AccesToken
              const data = await AccessToken.getCurrentAccessToken();

              if (!data) {
                throw 'Something went wrong obtaining access token';
              }
              // Create a Firebase credential with the AccessToken
              const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
              // Sign-in the user with the credential
              await auth().signInWithCredential(facebookCredential)
              await auth().signInWithCredential(googleCredential)
              .then(() => {
                firestore().collection('users').doc(auth().currentUser.uid)
                .set({
                    id: auth().currentUser.uid,
                    name: auth().currentUser.displayName,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    about: '',
                    followers: [],
                    following: [],
                })
                .catch(error => {
                    console.log('Something went wrong with added user to firestore: ', error);
                })
              })
              .catch(error => {
                console.log('Something went wrong with fb login: ', error);
                alert(e);
              });
            } catch(error) {
              console.log({error});
              alert(e);
            }
          },
          register: async (email, password, name) => {
            try {
              await auth().createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore().collection('users').doc(auth().currentUser.uid)
                .set({
                    id: auth().currentUser.uid,
                    name: name,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    about: '',
                    followers: [],
                    following: [],
                })
                .catch(error => {
                    console.log('Something went wrong with added user to firestore: ', error);
                })
              });

              auth().currentUser.updateProfile({
                displayName: name,
              })
              .catch((error) => {
                console.log('Error updating displayName:', error);
              });           
            
            } catch (e) {
              console.log(e);
              alert(e);
            }
          },
          googleSignup: async () => {
            try{
              // Get the users ID token
              const { idToken } = await GoogleSignin.signIn();
              // Create a Google credential with the token
              const googleCredential = auth.GoogleAuthProvider.credential(idToken);
              // Sign-in the user with the credential
              await auth().signInWithCredential(googleCredential)
              .then(() => {
                firestore().collection('users').doc(auth().currentUser.uid)
                .set({
                    id: auth().currentUser.uid,
                    name: auth().currentUser.displayName,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    about: '',
                    followers: [],
                    following: [],
                })
                .catch(error => {
                    console.log('Something went wrong with added user to firestore: ', error);
                })
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
                alert(e);
              });
            } catch(error) {
              console.log({error});
              alert(e);
            }
          },
          fbSignup:async () => {
            try {
              // Attempt login with permissions
              const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

              if (result.isCancelled) {
                throw 'User cancelled the login process';
              }

              // Once signed in, get the users AccesToken
              const data = await AccessToken.getCurrentAccessToken();

              if (!data) {
                throw 'Something went wrong obtaining access token';
              }

              // Create a Firebase credential with the AccessToken
              const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

              // Sign-in the user with the credential
              await auth().signInWithCredential(facebookCredential)
              .then(() => {
                firestore().collection('users').doc(auth().currentUser.uid)
                .set({
                    id: auth().currentUser.uid,
                    name: auth().currentUser.displayName,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: auth().currentUser.photoURL,
                    about: '',
                    followers: [],
                    following: [],
                })
                .catch(error => {
                    console.log('Something went wrong with added user to firestore: ', error);
                })
              })
              .catch(error => {
                  console.log('Something went wrong with sign up: ', error);
              });
            } catch(error) {
              console.log({error});
            }
          }, 
          logout: async () => {
            try {
              await auth().signOut();
            } catch (e) {
              console.error(e);
            }
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };