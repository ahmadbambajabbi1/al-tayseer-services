"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { fadeIn, slideIn } from "@/lib/animations"
import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export function CtaSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative isolate overflow-hidden bg-sky-600 py-20 sm:py-24"
    >
      <div className="absolute -top-80 left-[max(50%,25rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-30rem)]">
        <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-sky-300 to-blue-300 opacity-25" />
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-col items-center">
          <motion.h2
            variants={fadeIn("up", 0.2)}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center"
          >
            Ready to experience the {APP_NAME} difference?
          </motion.h2>

          <motion.p variants={fadeIn("up", 0.3)} className="mt-6 text-lg leading-8 text-sky-100 text-center max-w-2xl">
            Join thousands of satisfied customers who have transformed their laundry routine. Sign up today and enjoy
            fresh, professionally cleaned clothes delivered to your doorstep.
          </motion.p>

          <motion.div
            variants={slideIn("up", "tween", 0.4, 0.5)}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-6 bg-white text-sky-600 hover:bg-sky-50 hover:text-sky-700"
            >
              <Link href="/auth/signup">Get Started Now</Link>
            </Button>
            <Button asChild variant="link" size="lg" className="text-base text-white hover:text-sky-100">
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
        </div>
      </div>
    </motion.section>
  )
}
