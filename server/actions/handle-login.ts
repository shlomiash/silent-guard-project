"use server";

//General Imports
import { actionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";

//Schema Imports
import { LoginSchema } from "@/schemas/login-schema";
import type { LoginSchemaType } from "@/schemas/login-schema";

//my Imports
import { db } from "@/server/db/db";
import { usersTable } from "../db/schema";

import { signIn } from "@/auth";

export const handleLogin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.email, email), eq(usersTable.password, password))
      );
    if (existingUser.length === 0) {
      return { error: "Incorrect credentials" };
    } else {
      await signIn("credentials", { email, password });
      return { success: "Successfully logged in" };
    }
  });
