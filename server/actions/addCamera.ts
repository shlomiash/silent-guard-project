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
  .action(async ({ parsedInput: { admin,password,url } }) => {

    const fullURL  = `http://81.218.244.80:5000/stream?url=${url}/video`;
    console.log("fullURL", fullURL);

    //Checking if User exists
    const existingCamera= await db 
    .select()
    .from(camerasTable)
    .where( eq(camerasTable.connectionUrl, fullURL))

    if (existingCamera.length > 0) {
        //Check if the camera already exists in the same category
        //If it does, return an error message
      return { error: "Already exisiting camera" };
    }

    //If the camera does not exist, add it to the database

    fetch(fullURL, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(admin + ':' + password)
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => {
                throw new Error(`Error ${response.status}: ${msg}`);
            });
        }
        return response.text();
    })
    .then(data => {
        console.log('Data received:', data);
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });


    const newCamera = {
        admin,
        password,
        connectionUrl: fullURL,
    }

      return { success: "Successfully logged in" };
    }
);
