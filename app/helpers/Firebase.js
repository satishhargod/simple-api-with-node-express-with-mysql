const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const firebase = require('firebase');
const env = process.env.NODE_ENV || 'development';
const Config = require('../config/config');
const admin = require("firebase-admin");
const serviceAccount = require(`../storage/fcmServiceAccountKey.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: Config.FIREBASE_CONFIG.databaseURL
});

firebase.initializeApp(Config.FIREBASE_CONFIG);

//export async function createFirebase(email, password) {
const createFirebase = (email, password) => {
  try {
    const uid = firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userRecord) => {
        return userRecord.user.uid;
      }).catch((error) => {
        console.log("--------", error);
        throw new ApiError(httpStatus.BadRequest, error.message);
      });
    return uid;
  } catch (err) {
    console.log("---------Error------", err);
  }
}

//export async function updateFirebase(email, password, newPassword) {
const updateFirebase = (email, password, newPassword) => {
  try {
    const responseData = firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user.updatePassword(newPassword)
        return true;
      }).catch((error) => {
        throw new ApiError(httpStatus.BadRequest, error.message);
      });
    return responseData;
  } catch (err) {
    console.log("---------Error------", err);
  }
}

const addUserOnFirebase = async (uid, params) => {
  try {
    return new Promise(async (resolve, reject) => {
      const db = admin.firestore();
      await db.collection('users').doc(uid).set(params).catch((error) => {
        console.log("**********", error);
        throw new ApiError(httpStatus.BadRequest, error.message);
      });
      return resolve(true);
    });
  } catch (err) {
    console.log("---------Error------", err);
  }
}

const updateUserOnFirebase = async (uid, params) => {
  try {
    const db = admin.firestore();
    await db.collection('users').doc(uid).update(params).catch((error) => {
      console.log("**********", error);
      throw new ApiError(httpStatus.BadRequest, error.message);
    });
    return true;
  } catch (err) {
    console.log("---------Error------", err);
  }
}

const getUserOnFirebase = async (uid) => {
  try {
    return new Promise(async (resolve, reject) => {
      const db = admin.firestore();
      await db.collection('users').doc(uid).get().then((res) => {
        resolve(res.data());
      }).catch((error) => {
        resolve(null);
      });
    });
  } catch (err) {
    console.log("---------Error------", err);
  }
}

//export async function createFirebase(email, password) {
const userFirebaseSignIn = (email, password) => {
  try {
    return new Promise(async (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return resolve({ data: user, status: true });
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("error", errorMessage);
          if (errorMessage === "The password is invalid or the user does not have a password.") {
            return resolve({ data: null, status: true });
          }
          return resolve({ data: null, status: false });
        });
    });
  } catch (err) {
    console.log("---------Error------", err);
  }
}

module.exports = {
  createFirebase,
  updateFirebase,
  userFirebaseSignIn,
  addUserOnFirebase,
  updateUserOnFirebase,
  getUserOnFirebase
}
