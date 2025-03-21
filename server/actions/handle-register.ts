'use server'

//General Imports
import { actionClient } from "@/lib/safe-action";

//Schema Imports
import { RegisterSchema } from "@/schemas/register-schema";
import type { RegisterSchemaType } from "@/schemas/register-schema";

export const handleRegister = actionClient
  .schema(RegisterSchema).action(async ({ parsedInput: { ITid, username, password ,name} }) => {

    if (ITid === "123456789") {
        return {success: "Successfully registered"}
    }
    return { error: "Incorrect ITid" };


  });
