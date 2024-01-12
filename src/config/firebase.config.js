import {getApp,getApps,initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey:import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain:import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId:import.meta.env.VITE_REACT_APP_PROJECT_ID, 
    storageBucket:import.meta.env.VITE_REACT_APP_STORAGE_BUCKET, 
    messagingSenderId:import.meta.env.VITE_REACT_APP_MESSAGE_SENDER_ID,
    appId:import.meta.env.VITE_REACT_APP_APP_ID 
  };

const app=getApps.length>0 ? getApp():initializeApp(firebaseConfig)
const auth=getAuth(app)
const db=getFirestore(app)
const storage=getStorage(app)

export {auth,db,storage}