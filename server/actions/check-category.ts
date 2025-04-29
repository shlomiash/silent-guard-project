"use server";

//my Imports
import { db } from "@/server/db/db";
import { categoriesTable } from "../db/schema";
import {  eq } from "drizzle-orm";



export const checkCategoryId = async (categoryId : string) => {



       //Checkings to see if the user exists and if the category name and color already exists
        const existingCategory = await db.select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId));


        if (existingCategory.length === 0) {
          return { error: "Category Does Not Exist!" };
        }

        // Here we will fetch category cameras.
        // For now lets just return success.
        return { success: "Category fetched" };
      };

