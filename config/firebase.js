import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA2YLrcs_I-_bT3RBPB0CQAyzP1_i2-LzA",
    authDomain: "taskmanagementapp-b20b0.firebaseapp.com",
    projectId: "taskmanagementapp-b20b0",
    storageBucket: "taskmanagementapp-b20b0.appspot.com",
    messagingSenderId: "328149017281",
    appId: "1:328149017281:web:088edf7db509593eb86a40"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
