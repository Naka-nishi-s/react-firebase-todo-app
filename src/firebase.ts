import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCvr6IMLVoDsBJhPrvKZVMNyYBU5UVe8KA",
	authDomain: "react-firebase-todo-app-a8f09.firebaseapp.com",
	projectId: "react-firebase-todo-app-a8f09",
	storageBucket: "react-firebase-todo-app-a8f09.appspot.com",
	messagingSenderId: "1055375621336",
	appId: "1:1055375621336:web:de69a6afa8cb5ee301ebad",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
