"use client"

import { motion } from "framer-motion"
import { Truck, Shield, Leaf, Clock, Sparkles, Banknote, Smartphone, MessageSquare } from "lucide-react"
import { fadeIn, staggerContainer } from "@/lib/animations"
import { APP_FEATURES } from "@/lib/constants"

const iconComponents = {
  Truck,
  Shield,
  Leaf,
  Clock,
  Sparkles,
  Banknote,
  Smartphone,
  MessageSquare,
}

export function FeaturesSection() {
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
          <h2 className="text-base font-semibold leading-7 text-sky-600">Premium Service</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A better way to care for your clothes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the difference with our cutting-edge laundry services designed to make your life easier while
            providing exceptional care for your garments.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
        >
          {APP_FEATURES.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents] || Sparkles

            return (
              <motion.div key={feature.title} variants={fadeIn("up", 0.2 + index * 0.1)} className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-sky-100 to-blue-50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col h-full p-6 rounded-xl border border-gray-200 group-hover:shadow-lg transition-shadow duration-500">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-white mb-5 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold leading-7 text-gray-900 group-hover:text-sky-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 flex-1">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
