// /api/users/update-profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json()
    const { name, college, city, profileImage } = reqBody;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        error: "User not found",
      }, { status: 404 });
    }

    // Update user data with the request body
    const updatedUser = await User.findByIdAndUpdate(userId, {
      name: name,
      college: college,
      city: city,
      profileImage: profileImage,
    }, { new: true });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 400 });
  }
}
