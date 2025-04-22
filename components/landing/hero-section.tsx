"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations"
import { APP_NAME, APP_TAGLINE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export function HeroSection() {
  const { data: session } = useSession()
  const [animateCompleted, setAnimateCompleted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCompleted(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.section
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative isolate overflow-hidden bg-gradient-to-b from-sky-50 to-white py-24 sm:py-32"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20 overflow-hidden">
        <svg
          className="absolute left-[calc(50%-18rem)] top-0 h-[42rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)]"
          viewBox="0 0 1155 678"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeIn("right", 0.3)} className="text-center lg:text-left">
            <motion.h1
              variants={fadeIn("up", 0.4)}
              className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              <span className="text-sky-600">{APP_NAME}</span>
              <br />
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl">
                <span className="inline-block mr-2">{APP_TAGLINE}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={animateCompleted ? { opacity: [0, 1, 0], y: [0, 0, -10] } : {}}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                  className="inline-block"
                >
                  👕
                </motion.span>
              </span>
            </motion.h1>

            <motion.p variants={fadeIn("up", 0.5)} className="mt-6 text-lg leading-8 text-gray-600">
              Experience the luxury of pristine laundry without the hassle. Our premium mobile wash services come to
              you, providing exceptional care for your garments with eco-friendly processes and attention to detail.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.7)}
              className="mt-10 flex flex-col sm:flex-row items-center gap-y-4 sm:gap-x-6 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 shadow-lg"
              >
                <Link href={session ? "/services" : "/auth/signup"}>Get Started Today</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
                <Link href="/services" className="flex items-center gap-2">
                  <span>View Services</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={slideIn("right", "tween", 0.4, 1)} className="relative lg:ml-auto">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="Fresh laundry service"
                  width={600}
                  height={800}
                  className="rounded-2xl object-cover w-full h-[500px]"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={cn(
                  "absolute -bottom-8 -left-8 rounded-2xl bg-white p-6 shadow-xl",
                  "flex items-center gap-4 border",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-sky-600">Quality Guaranteed</p>
                  <p className="text-sm text-gray-600">100% Satisfaction</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={cn(
                  "absolute -top-8 -right-8 rounded-2xl bg-white p-6 shadow-xl",
                  "flex items-center gap-4 border",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-sky-600">Fast Service</p>
                  <p className="text-sm text-gray-600">24-48h Turnaround</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
