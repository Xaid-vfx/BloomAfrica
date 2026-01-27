import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


export const SignOut = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    // alert("Signed out")
    console.log("signed out");

}