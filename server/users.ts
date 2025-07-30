"use server";

import { auth } from "@/lib/auth";

export const signInUser = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return  {success: true, message: "Sign in successful"};
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Sign in failed" };
  }
};


export const signUpUser = async (email: string, password: string, name: string) => {
    try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return  {success: true, message: "Signed up successfully"};
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Failed to Sign Up!" };
  }
};
