'use client';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	GoogleAuthProvider,
	getAuth,
	User,
	NextOrObserver,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth';
import {
	googleSignInWithPopup,
	userSignOut,
	userAuthStateChangeListener,
	createFirebaseUser,
	signInFirebaseUser,
	sendFirebaseUserPasswordResetEmail,
	deleteFirebaseUser,
	updateFirebaseUserEmail,
	reauthenticateFirebaseUser, updateFirebaseUserPassword,
} from "@/firebase/firebase.utils";
import { IFirebaseCreateUserProps } from "@/lib/types/definitions.firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const initializeFirebase = () => {
	const firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
	};
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	
	return { app, analytics };
}

// Initialize Firebase to get the app and analytics object
const { app, analytics } = initializeFirebase();

const auth = getAuth();

/*
* Logic for handling the google-sign in below here
* */

/*
* @function handleGoogleSignIn
* @description This function handles the google-sign in
* @param {void}
* */
export const handleGoogleSignIn = () => {
	// Initialize the googleAuth provider
	return setPersistence(auth, browserLocalPersistence).then(() => {
		const provider = new GoogleAuthProvider();
		return googleSignInWithPopup(auth, provider);
	})
		.catch((error) => {
			console.error("Error occurred while setting persistence: ");
			console.error(error);
		});
}

/*
* @function handleUserSignOut
* @description This function handles the user out
* */
export const handleUserSignOut = () => {
	return userSignOut(auth);
}


/*
* @function handleFirebaseSignUp
* @description This function handles the firebase sign up
* @param {IFirebaseCreateUserProps} data
* */
export const handleFirebaseSignUp = (data: IFirebaseCreateUserProps) => {
	return createFirebaseUser(auth, data);
}

/*
* @function handleFirebaseSignIn
* @description This function handles the firebase sign in
* @param {string} email
* @param {string} password
* */
export const handleFirebaseSignIn = (email: string, password: string) => {
	return setPersistence(auth, browserLocalPersistence).then(() => {
		return signInFirebaseUser(auth, email, password);
	})
	.catch((error) => {
		console.error("Error occurred while setting persistence: ");
		console.error(error);
	});
}

/*
* @function onAuthStateChangeListener
* @description This function listens for changes in the user's authentication state
* @param {User} user
* */
export const handleAuthStateChangeListener = (callback: NextOrObserver<User>) => {
	return userAuthStateChangeListener(auth,callback);
}

export const handlePasswordResetEmail = (email: string) => {
	return sendFirebaseUserPasswordResetEmail(auth, email);
}

export const handleDeleteFirebaseUser = () => {
	return deleteFirebaseUser(auth);
}

export const handleUpdateFirebaseUserEmail = (newEmail: string) => {
	return updateFirebaseUserEmail(auth, newEmail);
}

export const handleUpdateFirebaseUserPassword = (newPassword: string) => {
	return updateFirebaseUserPassword(auth, newPassword);
}

export const handleReauthenticateFirebaseUser = (email:string, password: string) => {
	return reauthenticateFirebaseUser(auth, email, password);
}