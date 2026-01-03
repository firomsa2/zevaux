"use client";

import { Card } from "@/components/ui/card";
import {
  Star,
  Quote,
  Hexagon,
  Triangle,
  Circle,
  Box,
  Layers,
  Command,
} from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Zevaux has completely transformed how we handle customer calls. We never miss a lead now, and our clients love the instant response.",
    author: "Sarah Johnson",
    role: "Operations Director",
    company: "Nexus",
  },
  {
    quote:
      "The AI sounds incredibly human. Our customers don't even realize they're talking to a bot until we tell them. It's been a game changer.",
    author: "Michael Chen",
    role: "CEO",
    company: "Vortex",
  },
  {
    quote:
      "Setup was a breeze. We were up and running in minutes. The dashboard gives us clear insights into all our calls.",
    author: "Emily Davis",
    role: "Office Manager",
    company: "Sphere",
  },
];

const COMPANIES = [
  { name: "Nexus", icon: Hexagon },
  { name: "Vortex", icon: Triangle },
  { name: "Sphere", icon: Circle },
  { name: "Cube", icon: Box },
  { name: "Stack", icon: Layers },
  { name: "Cmd", icon: Command },
];

export default function CustomersSection() {
  return (
    <section id="customers" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted By Logos */}
        <div className="text-center mb-24">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-10">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {COMPANIES.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors cursor-default select-none group"
              >
                <company.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Loved by Businesses
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See what our customers have to say about their experience with
            Zevaux.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 border-none shadow-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              {/* <Quote className="w-10 h-10 text-primary/20" /> */}
              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.author.charAt(0)}
                </div> */}
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
