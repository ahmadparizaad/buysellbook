'use client'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const Carousel = ({ data }: { data: { image: string }[] }) => {
  const [currentImg, setCurrentImg] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Function to detect hover position and slide accordingly
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - left

    if (mouseX < width * 0.3 && currentImg > 0) {
      setCurrentImg((prev) => prev - 1)
    } else if (mouseX > width * 0.7 && currentImg < data.length - 1) {
      setCurrentImg((prev) => prev + 1)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center">
      {/* Carousel Container */}
      <div
        className="relative h-96 w-96 overflow-hidden rounded-md"
        onMouseMove={handleMouseMove}
      >
        {/* Image Container */}
        <div
          ref={carouselRef}
          style={{
            transform: `translateX(-${currentImg * 80}%)`, // Adjusted for proper sliding
          }}
          className="absolute flex h-full transition-transform duration-300"
        >
          {data.map((v, i) => (
            <div key={i} className="relative h-full flex-shrink-0 mx-[-5px]">
              <Image
                className="pointer-events-none object-contain rounded-xl"
                alt={`carousel-image-${i}`}
                src={v.image || 'https://random.imagecdn.app/500/500'}
                width={300} // Ensures full visibility
                height={340} // Keeps aspect ratio
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
