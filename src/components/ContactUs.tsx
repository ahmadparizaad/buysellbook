"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image";

const   ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate mandatory fields
    if (!name || !email || !description) {
      setError("Name, email, and description are required.");
      return;
    }

    // Handle form submission logic here
    // For example, send the data to an API

    setSuccess("Your message has been sent successfully!");
    // Reset form fields
    setName("");
    setEmail("");
    setDescription("");
    setAttachment(null);
  };

  return (
    <>    
    <div className="mb-10 min-h-screen w-screen px-6 md:px-16 flex flex-col items-center">
  <h1 className="mt-10 mb-6 text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
    Contact Us
  </h1>

  <div className="flex flex-wrap justify-center md:justify-between items-start w-full max-w-6xl">
    {/* Form Section */}
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col justify-center items-center w-full md:w-1/2 p-4"
    >
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div>
        <label className="block text-sm font-medium text-white pl-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="text-black mb-4 mt-2 w-[35vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white pl-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black mb-4 mt-2 w-[35vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white pl-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="text-black mb-4 mt-2 w-[35vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white pl-1">
          Attachment (optional)
        </label>
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          className="text-black mb-4 mt-2 w-[35vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        className="border px-4 py-2 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200"
      >
        Submit
      </Button>
    </form>

    {/* Image Section */}
    <div className="hidden md:block w-full md:w-1/2 px-4">
      <Image
        src="/contact.svg"
        alt="Contact"
        height={500}
        width={400}
        className="object-contain"
      />
    </div>
  </div>
</div>

      </>
  );
};

export default ContactUs;