import usersRepository from "@/server/models/users/users.query";
import { createClient } from "../supabase/server";
import { User } from "@/server/models/users/users.type";
import { NextResponse } from "next/server";


/** --------- Auth --------- */
export async function requireUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    const user = await usersRepository.getUserByClerkId(data?.claims?.sub as string);
    return user || null;

  } catch (error) {
    console.log("Context Creation Failed", error)
    return null;
  }
}

export async function authorizeUser(): Promise<User>{
  try {
    const user = await requireUser()
    if(!user){
      throw new Error("Not Authorized")
    }
    return user
  } catch (error) {
    console.log("🚀 ~ authorizeUser ~ error:", error)
    throw new Error("Not Authorized")
  }
}