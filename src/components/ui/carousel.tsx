'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const slideWidth = 384 // corresponds to Tailwind's w-96

const Carousel = ({ data }: { data: { image: string }[] }) => {
  const [currentImg, setCurrentImg] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev === data.length - 1 ? 0 : prev + 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [data.length])

  return (
    <div className="flex flex-col items-center overflow-hidden bg-gray-400/20 rounded-3xl p-3">
      {/* Carousel Container */}
      <div className="relative h-80 w-96 overflow-hidden rounded-md">
        {/* Sliding container with fixed pixel width */}
        <div
          ref={carouselRef}
          style={{
            width: `${data.length * slideWidth}px`,
            transform: `translateX(-${currentImg * slideWidth}px)`,
          }}
          className="absolute flex h-full transition-transform duration-300"
        >
          {data.map((v, i) => (
            <div key={i} className="relative h-full w-96 flex-shrink-0">
              {/* Relative wrapper for Next.js Image */}
              <div className="relative h-full w-full">
                <Image
                  src={
                    v.image ||
                    'https://imgs.search.brave.com/-jECYjiPs2ms18A1J5ZBPuf_NCglf6PouYjY2fQHCvA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhyaWZ0Ym9v/a3MuY29tL2dlbmVy/YWwvZHQtc18xMGVk/MWFkMi5qcGc'
                  }
                  alt={`carousel-image-${i}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="pointer-events-none rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
