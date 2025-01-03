import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function UserProfile({params}: any) {

    return (
        <div className="text-white flex flex-col items-center justify-center min-h-screen py-2 z-[9] w-full overflow-x-hidden">
            <h1>Profile</h1>
            <hr />
            <p className="text-4xl">Profile page 
            <span className=" p-2 ml-2 rounded bg-orange-500 text-black">{params._id}</span>
            </p>
        </div>
    )
}