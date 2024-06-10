import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore/lite";

//config
const firebaseConfig = {
  apiKey: "AIzaSyD9Y2seBjrvbwg9vBcEdgiS_9pOPWkRelU",
  authDomain: "electiva-ff387.firebaseapp.com",
  projectId: "electiva-ff387",
  storageBucket: "electiva-ff387.appspot.com",
  messagingSenderId: "334267198414",
  appId: "1:334267198414:web:ad59685d44d4a9a8f0d99f",
  measurementId: "G-NH9575PRFB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
export const getAllRegistersByCollection = async (collectionName) => {
  try {
    const dataCollection = await getDocs(collection(db, collectionName));
    return dataCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};

export const addDataToCollection = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateDataInCollection = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", docId);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

export const deleteDataFromCollection = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", docId);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};
