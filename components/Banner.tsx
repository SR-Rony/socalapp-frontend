"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Sparkles } from "lucide-react"
import bannerImage from "@/public/banner image.png"
import { Typewriter } from "react-simple-typewriter"

export default function BannerSection() {
  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Create Your Own Social Network
            </h1>

            {/* Paragraph */}
            <p className="text-xl text-muted-foreground max-w-xl">
              Sngine is the PHP leading social network software packed with customizable and amazing features.
              <span className="text-primary font-semibold">
                <Typewriter
                    words={["Fast & Secure", "Mobile Ready", "Customizable",]}
                    loop={true}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={60}
                    delaySpeed={1200}
                />.
                </span>
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" className="gap-2 text-md py-6">
                Buy Now
                <ShoppingCart className="w-4 h-4" />
              </Button>

              <Button variant="secondary" size="lg" className="gap-2 bg-[#5D6778] text-white text-md py-6 hover:bg-[#4a5261] font-bold cursor-pointer">
                Try Now
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <Image
              src={bannerImage}
              alt="Banner Image"
              width={700}
              height={700}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
