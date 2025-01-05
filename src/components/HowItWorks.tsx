"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "@/components/ui/tracing-beam";


// import { calsans } from "@/styles/fonts";

export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center justify-center w-screen bg-white antialiased relative overflow-hidden px-4 font-[Gilroy]">
    <TracingBeam className="my-8 relative">
      <h1 className="mb-5 text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 bg-opacity-50">How It Works</h1>
      <div className="max-w-3xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10 flex flex-col md:flex-row justify-center">
            <div className="flex flex-col text-sm prose prose-sm dark:prose-invert">
              <h2 className="bg-black ml-6 text-white rounded-full text-lg w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>
              <p className="ml-6 mb-4 mr-10 text-base">
              {item.description}
              </p>
              
            </div>
            {item?.image && (
              <Image
                src={item.image}
                alt="blog thumbnail"
                height="250"
                width="300"
                className="rounded-lg ml-6 object-cover border-[1px] border-gray-500"
              />
            )}
          </div>
        ))}
      </div>
    </TracingBeam>
    </div>
  );
}

const dummyContent = [
  {
    title: "Step 1: User Registration",
    description: (
      <>
          Start by registering on our site, creating an account to access all features and services.
      </>
    ),
    badge: "Registration",
    image: "/register.png",
  },
  {
    title: "Step 2: Complete Your Profile",
    description: (
      <>
          After registration, complete your profile to connect with other users effectively.
      </>
    ),
    badge: "Profile Setup",
    image: "/profile.png",
  },
  {
    title: "Step 3: Browse Available Books",
    description: (
      <>
          You can browse through a variety of books being sold by nearby individuals, making it easy to find what you need.
      </>
    ),
    badge: "Browse Books",
    image: "/browse.png",
  },
  {
    title: "Step 4: Select and Contact Seller",
    description: (
      <>
          Once you find a book to buy, you can select it and initiate a conversation with the seller to buy.
      </>
    ),
    badge: "Contact Seller",
    image: "/chat.png",
  },
  {
    title: "Step 5: Meet and Purchase",
    description: "Finally, you arrange to meet the seller in person to complete the purchase of the book.",
    badge: "Purchase",
    image: "/purchase.png",
  },
];
