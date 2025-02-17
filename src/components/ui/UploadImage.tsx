'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button"

export default function UploadImage() {
  return (
    <CldUploadWidget signatureEndpoint="/api/sign-image">
      {({ open }) => {
        return (
          <Button variant="outline" onClick={() => open()}
          className='my-2 border-2 px-5 py-1 border-gray-700 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'>
            Upload Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}