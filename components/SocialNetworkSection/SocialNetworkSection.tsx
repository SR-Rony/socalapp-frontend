"use client"

import { Button } from "@/components/ui/button"
import { Zap, ShieldCheck, Settings, Users,CircleArrowRight } from "lucide-react"
import { HiArrowLongRight } from "react-icons/hi2";

const features = [
  {
    icon: Zap,
    title: "Quick and Simple",
    description:
      "100% white label with no \"powered by\". Maintain total control over your community's look and feel, easily adding your own logo, colors & layout.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Built with modern security standards to protect your data and your members with confidence.",
  },
  {
    icon: Settings,
    title: "Fully Customizable",
    description:
      "Easily configure features, permissions, and design to perfectly match your business needs.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "Powerful tools to engage users, manage communities, and grow your social network faster.",
  },
]

export default function SocialNetworkSection() {
  return (
    <section className="w-full py-20 bg-[#F5F6FE]">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Start your own social network today!
          </h2>
          <p className="text-muted-foreground font-medium text-lg md:text-xl">
            The best way to create your own social community
          </p>
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-background p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-primary mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xl font-normal mb-4">
                {item.description}
              </p>

              {/* Learn more */}
              <a
                href="#"
                className="inline-flex items-center text-xl font-medium text-primary hover:underline"
              >
                Learn more
                <HiArrowLongRight className="ml-1 h-4 w-6" />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-16 flex justify-center">
          <Button size="lg" className="gap-2 bg-transparent text-primary  hover:bg-white rounded-sm hover:shadow-2xl">
            Get Started
            <CircleArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
