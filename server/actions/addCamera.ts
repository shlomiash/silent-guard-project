"use server";

//General Imports
import { actionClient } from "@/lib/safe-action";
import {eq } from "drizzle-orm";

//Schema Imports
import { LoginSchema } from "@/schemas/login-schema";
import type { LoginSchemaType } from "@/schemas/login-schema";

//my Imports
import { db } from "@/server/db/db";
import { camerasTable, usersTable } from "../db/schema";

import { signIn } from "@/auth";
import { CameraSchema } from "@/schemas/camera-schema";

export const addCamera = actionClient
  .schema(CameraSchema)
  .action(async ({ parsedInput: { admin,password,url,categoryID,name } }) => {

    //Checking if User exists
    const existingCamera= await db 
    .select()
    .from(camerasTable)
    .where( eq(camerasTable.connectionUrl, url))

    if (existingCamera.length > 0) {
        //Check if the camera already exists in the same category
        //If it does, return an error message
      return { error: "Already exisiting camera" };
    }

    //Checking name, password, url, categoryID, admin is not null
    if (!name || !password || !url || !categoryID || !admin) {
        throw new Error("Missing required camera data");
      }

    //If the camera does not exist, add it to the database
    await db.insert(camerasTable).values({
        name,
        password,
        connectionUrl: url,
        categoryId: categoryID,
        admin,
      });   

      return { success: "Successfully logged in" };
    }
);
