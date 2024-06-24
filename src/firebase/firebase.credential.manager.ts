import { User} from "firebase/auth";

export const validateGoogleEmailAddress = (user: User) => {
	// ensure that teh users email address is validated
	if(user.emailVerified) {
		return true;
	} else {
		return false;
	}
}

export const validateFirebaseTokenOnServer = async (user: User) => {
	// ensure the firebase token is valid on our server
}