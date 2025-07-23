import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
	useEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == "PASSWORD_RECOVERY") {
                console.log(session.user.email)
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

    return (
        <p>blah blah blah</p>
    )
}
