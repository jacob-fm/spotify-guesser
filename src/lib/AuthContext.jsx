import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { isValidGameArray, safeParse } from "../hooks/validateJSON";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [todaysGameExistsInSupabase, setTodaysGameExistsInSupabase] = useState(
    false,
  );
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

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

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN" && session?.user) {
        onUserLogin(session);
      }
    });
  }, []);

  // check supabase to see if there's a score for today
  useEffect(() => {
    const checkSupa = async () => {
      if (session?.user) {
        const { data: existing, error: existingError } = await supabase
          .from("user_scores")
          .select()
          .eq("user_id", session.user.id)
          .gte("game_date", `${today}T00:00:00.000Z`)
          .lte("game_date", `${today}T23:59:59.999Z`)
          .maybeSingle();

        if (existingError) {
          console.error(
            "Error checking Supabase for existing games",
            existingError,
          );
        } else if (existing) {
          setTodaysGameExistsInSupabase(true);
          localStorage.setItem("lastDateCompleted", today);
        } else {
          setTodaysGameExistsInSupabase(false);
        }
      }
    };
    checkSupa();
  }, [today, session]);

  async function onUserLogin(session) {
    // if game was already uploaded today, don't upload again
    if (localStorage.getItem("lastDateUploaded") === today) {
      return;
    }

    const lastDateCompleted = localStorage.getItem("lastDateCompleted");
    if (lastDateCompleted === today) {
      const storedGame = safeParse(localStorage.getItem("currentGame"));
      if (isValidGameArray(storedGame)) {
        const { error } = await supabase.functions.invoke("submit-score", {
          method: "POST",
          body: {
            user_id: session.user.id,
            rounds: storedGame,
          },
        });
        if (!error) {
          localStorage.setItem("lastDateUploaded", today);
        }
      }
    }
  }

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
      value={{
        session,
        signUpNewUser,
        loginUser,
        sendPasswordReset,
        updatePassword,
        signOut,
        todaysGameExistsInSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
