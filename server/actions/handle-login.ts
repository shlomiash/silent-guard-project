"use server";

//General Imports
import { actionClient } from "@/lib/safe-action";

//Schema Imports
import { LoginSchema } from "@/schemas/login-schema";
import type { LoginSchemaType } from "@/schemas/login-schema";

export const handleLogin = actionClient
.schema(LoginSchema)
.action(async ({parsedInput:{email,password}}) => {
  if (email === "SilentGuard@gmail.com" && password === "123456") {
    return {
      success: "Successfully logged in",
    };
  }

  return { error: "Incorrect credentials" };
});

