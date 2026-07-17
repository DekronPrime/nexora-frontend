"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Layout,
  Users,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Layout,
    title: "Kanban Boards",
    description: "Organize your tasks with intuitive drag-and-drop columns.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members and assign tasks seamlessly.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Stay in sync with instant notifications and activity logs.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor project progress with visual dashboards.",
  },
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Create, prioritize, and track tasks with ease.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Projects Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9", label: "User Rating" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b-[3px] border-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 min-w-[175px]">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold font-unbounded bg-gradient-to-br from-blue-600 to-cyan-500 text-xl bg-clip-text text-transparent">
                Nexora
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#about"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                About
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="default">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-50" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>Free to get started</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Manage Projects
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                With Clarity & Focus
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-sofia text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Nexora is a modern project management tool that helps teams
              organize, track, and deliver projects with ease. Simple yet
              powerful.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl shadow-blue-500/25 gap-2 text-base px-8"
                >
                  Start Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Kanban Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    title: "To Do",
                    tasks: ["Design homepage", "Setup database", "Create auth"],
                    color: "slate",
                  },
                  {
                    title: "In Progress",
                    tasks: ["Build API endpoints", "Implement login"],
                    color: "blue",
                  },
                  {
                    title: "Review",
                    tasks: ["Code review PR #42"],
                    color: "amber",
                  },
                  {
                    title: "Done",
                    tasks: ["Project setup", "Deploy staging"],
                    color: "emerald",
                  },
                ].map((column, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-700">
                        {column.title}
                      </h3>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task, j) => (
                        <div
                          key={j}
                          className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <p className="text-sm text-slate-700">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage projects
            </h2>
            <p className="text-lg text-slate-600">
              Powerful features designed to help your team work smarter, not
              harder.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to transform your workflow?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join thousands of teams already using Nexora to deliver projects
              faster.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-xl shadow-blue-500/30 gap-2 text-base px-8"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 min-w-[215px]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-base">N</span>
              </div>
              <span className="font-semibold font-unbounded bg-gradient-to-br from-blue-600 to-cyan-500 text-lg bg-clip-text text-transparent">
                Nexora
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                FaQ
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Help Center
              </a>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Nexora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
