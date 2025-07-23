import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [session, setSession] = useState(undefined);
	const [loading, setLoading] = useState(true);

	// Sign up
	const signUpNewUser = async (email, password) => {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error("There was a problem signing up:", error);
			return { success: false, error: error };
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
				return { success: false, error: error }; // Return the error
			}

			// If no error, return success
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

	// Send password reset link
	const sendPasswordReset = async (email) => {
		try {
			const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: "https://spopularity.jacobfm.com/reset-password",
			});
			// Handle Supabase error explicitly
			if (error) {
				console.error("Error sending password reset link:", error.message); // Log the error for debugging
				return { success: false, error: error }; // Return the error
			}

			// if no error, return success
			return { success: true, data };
		} catch (err) {
			console.error("Error during passsword reset attempt:", err);
			return {
				success: false,
				error: "An unexpected error occurred. Please try again.",
			};
		}
	};

	const updatePassword = async (password) => {
		try {
			const { data, error } = await supabase.auth.updateUser({
				password: password,
			});

			// Handle Supabase error explicitly
			if (error) {
				console.error("Error setting new password:", error.message); // Log the error for debugging
				return { success: false, error: error }; // Return the error
			}

			// if no error, return success
			return { success: true, data };
		} catch (err) {
			console.error("Error setting new password:", err);
			return {
				success: false,
				error: "Unexpected error setting new password. Please try again.",
			};
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setLoading(false);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	if (loading) {
		return null;
	}

	// Sign out
	const signOut = () => {
		const { error } = supabase.auth.signOut();
		if (error) {
			console.error("There was an error: ", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ session, signUpNewUser, loginUser, sendPasswordReset, updatePassword, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
