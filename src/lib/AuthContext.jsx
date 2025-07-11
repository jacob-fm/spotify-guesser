import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [session, setSession] = useState(undefined);

	// Sign up
	const signUpNewUser = async (email, password) => {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error("There was a problem signing up:", error);
			return { success: false, error };
		}
		return { success: true, data };
	};

	// Sign in
	const loginUser = async (email, password) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.toLowerCase(),
				password: password,
			});

			// Handle Supabase error explicitly
			if (error) {
				console.error("Sign-in error: ", error.message); // Log the error for debugging
				return { success: false, error: error.message }; // Return the error
			}

			// If no error, return success
			console.log("Sign-in success: ", data);
			return { success: true, data };
		} catch (error) {
			// Handle unexpected issues
			console.error("Unexpected error during sign-in: ", error);
			return {
				success: false,
				error: "An unexpected error occurred. Please try again.",
			};
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	// Sign out
	const signOut = () => {
		const { error } = supabase.auth.signOut();
		if (error) {
			console.error("There was an error: ", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ session, signUpNewUser, loginUser, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
