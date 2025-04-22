"use client"

import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/lib/animations"

const steps = [
  {
    number: "01",
    title: "Browse Services",
    description:
      "Select from our range of premium laundry and dry cleaning services, customized to your specific needs.",
  },
  {
    number: "02",
    title: "Schedule Pickup",
    description: "Choose a convenient time for us to collect your laundry directly from your doorstep.",
  },
  {
    number: "03",
    title: "Expert Care",
    description:
      "Our professionals will clean and care for your clothes using eco-friendly methods and premium detergents.",
  },
  {
    number: "04",
    title: "Delivery & Enjoyment",
    description: "Receive your freshly cleaned clothes back at your door, perfectly folded and ready to wear.",
  },
]

export function HowItWorksSection() {
  return (
    <motion.section
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="py-24 bg-white"
    >
      <div className="container">
        <motion.div variants={fadeIn("up", 0.2)} className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-sky-600">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How SplashWash Works</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our streamlined process makes getting fresh, clean clothes effortless. From pickup to delivery, we handle
            everything so you don't have to.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer(0.1, 0.2)} className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div key={step.title} variants={fadeIn("up", 0.3 + index * 0.1)} className="relative">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-0 transform translate-x-1/2">
                      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 6H38.5M38.5 6L33.5 1M38.5 6L33.5 11" stroke="#0284c7" strokeWidth="2" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
