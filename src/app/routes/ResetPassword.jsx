import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
	useEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == "PASSWORD_RECOVERY") {
				const newPassword = prompt(
					"What would you like your new password to be?"
				);
				const { data, error } = await supabase.auth.updateUser({
					password: newPassword,
				});
				if (data) alert("Password updated successfully!");
				if (error) alert("There was an error updating your password.");
			}
		});
	}, []);
}
