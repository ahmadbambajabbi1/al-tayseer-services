"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn, staggerContainer } from "@/lib/animations";

const testimonials = [
  {
    content:
      "Al-Tayseer has transformed my weekly routine. Their pickup service is always on time, and my clothes come back perfectly clean and folded. It's the convenience I never knew I needed!",
    author: "Alex Morgan",
    role: "Marketing Executive",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
  },
  {
    content:
      "As a busy parent of three, I don't have time to handle laundry. Al-Tayseer delivers exceptional service with attention to detail. My kids' uniforms have never looked better!",
    author: "James Wilson",
    role: "Software Developer",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1534&q=80",
  },
  {
    content:
      "I was skeptical about a mobile laundry service, but Al-Tayseer exceeded my expectations. The eco-friendly options align with my values, and the quality is unmatched. Highly recommend!",
    author: "Sarah Chen",
    role: "Environmental Consultant",
    avatar:
      "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <motion.section
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="py-24 bg-gradient-to-b from-white to-sky-50"
    >
      <div className="container">
        <motion.div
          variants={fadeIn("up", 0.2)}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-base font-semibold leading-7 text-sky-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by customers
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Hear what our satisfied customers have to say about their experience
            with our premium laundry services.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.3)}
          className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              variants={fadeIn("up", 0.3 + index * 0.1)}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 h-full"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-lg font-medium leading-8 text-gray-600">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
