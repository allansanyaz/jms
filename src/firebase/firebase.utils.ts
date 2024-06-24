'use client';
import {
	Auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	EmailAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	User,
	updateProfile,
	updateEmail,
	updatePassword,
	sendPasswordResetEmail,
	deleteUser,
	reauthenticateWithCredential,
	NextOrObserver
} from "firebase/auth";
import { validateGoogleEmailAddress } from "@/firebase/firebase.credential.manager";
import { IFirebaseCreateUserProps } from "@/lib/types/definitions.firebase";

export const googleSignInWithPopup = async (auth: Auth, provider: GoogleAuthProvider) => {
	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		// make sure the email address is verified
		const verified = validateGoogleEmailAddress(user);
		if(verified) {
			return user;
		} else {
			console.error("User email address is not verified");
			return null;
		}
	} catch (error) {
		console.error("Error occurred while signing in with google: ");
		console.error(error);
	}
}

export const userAuthStateChangeListener = (auth: Auth, callback: NextOrObserver<User>) => {
	return onAuthStateChanged(auth, callback);
}

export const userSignOut = async (auth: Auth) => {
	try {
		await signOut(auth);
		return { success: true };
		console.log("User signed out successfully");
	} catch (error) {
		console.error("Error occurred while signing out: ");
		console.error(error);
		return { success: false, error };
	}
}

export const createFirebaseUser = async (auth: Auth, data: IFirebaseCreateUserProps) => {
	// create a user on our server
	try {
		const { firstName, lastName, email, password } = data;
		await createUserWithEmailAndPassword(auth, email, password);
		const currentUser = updateFirebaseUser(auth, { firstName, lastName });
		
		return currentUser;
		
	} catch (error) {
		console.error("Error occurred while creating user: ");
		console.error(error);
	}
}

export const signInFirebaseUser = async (auth: Auth, email: string, password: string) => {
	// sign in a user on our server
	try {
		const user = await signInWithEmailAndPassword(auth, email, password);
		return { success: true, user: user.user };
	} catch (error: any) {
		if(error.code === "auth/user-not-found") {
			return { success: false, error: "Wrong user/password combination" };
		} else if(error.code === "auth/invalid-credential") {
			return { success: false, error: "Wrong user/password combination" };
		} else {
			console.error("Error occurred while signing in user: ");
			console.error(error);
		}
	}
}

const updateFirebaseUser = async (auth: Auth, { firstName, lastName }: { firstName: string, lastName: string }) => {
	// update a user on our server
	try {
		await updateProfile(auth.currentUser as User, {
			displayName: `${firstName} ${lastName}`,
		});
		return auth.currentUser as User;
	} catch (error) {
		console.error("Error occurred while updating user: ");
		console.error(error);
	}
}

export const sendFirebaseUserPasswordResetEmail = async (auth: Auth, email: string) => {
	// update a user on our server
	try {
		await sendPasswordResetEmail(auth, email);
		return { success: true };
	} catch (error) {
		console.error("Error occurred while resetting the user email: ");
		console.error(error);
		return { success: false, error };
	}
}

export const updateFirebaseUserPassword = async (auth: Auth, password: string) => {
	// update a user on our server
	try {
		await updatePassword(auth.currentUser as User, password);
		return { success: true, user: auth.currentUser as User };
	} catch (error: any) {
		if(error.code === "auth/requires-recent-login") {
			return { success: false, error: "Please sign out and sign back in again", promptLogin: true };
		} else {
			console.error("Error occurred while updating user: ");
			console.error(error);
			return { success: false, error: "Could not update password, please sign out and back in again", promptLogin: false}
		}
	}
}

export const updateFirebaseUserEmail = async (auth: Auth, email: string) => {
	// update a user on our server
	try {
		await updateEmail(auth.currentUser as User, email);
		return { success: true, user: auth.currentUser as User };
	} catch (error: any) {
		if(error.code === "auth/requires-recent-login") {
			return { success: false, error: "Please sign out and sign back in again", promptLogin: true };
		} else {
			console.error("Error occurred while updating user: ");
			console.error(error);
			return { success: false, error: "Could not update email. Please sign out and sign back in again", promptLogin: false}
		}
	}
}

export const deleteFirebaseUser = async (auth: Auth) => {
	// update a user on our server
	try {
		await deleteUser(auth.currentUser as User);
		return { success: true };
	} catch (error: any) {
		console.error("Error occurred while deleting the user firebase: ");
		console.error(error);
		if(error.code === "auth/requires-recent-login") {
			return { success: false, error: "Please sign out and sign back in again", promptLogin: true };
		} else {
			console.error("Error occurred while deleting the user: ");
			console.error(error);
			return { success: false, error: "Error occurred while deleting tthe user account", promptLogin: false };
		}
	}
}

export const reauthenticateFirebaseUser = async (auth: Auth, email: string, password: string) => {
	// update a user on our server
	try {
		const credential = EmailAuthProvider.credential(email, password);
		await reauthenticateWithCredential(auth.currentUser as User, credential);
		return { success: true };
	} catch (error: any) {
		if(error.code === "auth/user-not-found") {
			return { success: false, error: "Wrong user/password combination" };
		} else if(error.code === "auth/invalid-credential") {
			return { success: false, error: "Wrong user/password combination" };
		} else {
			console.error("Error occurred while signing in user: ");
			console.error(error);
		}
	}
}