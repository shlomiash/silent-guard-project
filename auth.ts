import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/login-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials);
        console.log(
          "hereherehherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereherehereerehereherehereherehereherehereherehereherehereherehereherehere"
        );
        console.log(validateFields);
        let user = validateFields.data;
        // logic to salt and hash password

        // logic to verify if the user exists

        console.log(user);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
