import { useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin } from "lucide-react"

export default function Product() {

  // Smooth scroll enable
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-red-50/20 text-slate-800">

      {/* ================= HERO ================= */}
      <section id="hero" className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-5xl font-bold">
          Rayzo Product Architecture
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
          AI-powered lung X-ray intelligence platform built for secure,
          structured, and role-based medical analysis.
        </p>
      </section>

      {/* ================= SECTION NAVIGATION ================= */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-y border-slate-200 py-4">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 text-sm font-medium">
          <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
          <a href="#ai-analysis" className="hover:text-blue-600">AI Analysis</a>
          <a href="#reports" className="hover:text-blue-600">Reports</a>
          <a href="#about" className="hover:text-blue-600">About Team</a>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-14">

          <div>
            <h3 className="font-semibold text-lg mb-4">Technologies Used</h3>
            <ul className="space-y-2 text-slate-600">
              <li>• React + Tailwind CSS (Frontend)</li>
              <li>• Spring Boot REST API (Backend)</li>
              <li>• MongoDB (Database)</li>
              <li>• CNN-based Deep Learning Model</li>
              <li>• JWT Authentication (Role-Based Access)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Overall Workflow</h3>
            <ul className="space-y-2 text-slate-600">
              <li>• Doctor uploads X-ray image</li>
              <li>• AI model analyzes lung patterns</li>
              <li>• Disease probabilities generated</li>
              <li>• Structured report created</li>
              <li>• Stored securely for doctor & patient access</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= AI ANALYSIS ================= */}
      <section id="ai-analysis" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">AI Analysis</h2>

          <p className="text-slate-600 max-w-3xl mb-8">
            The AI engine uses convolutional neural networks (CNN) to extract
            spatial features from chest X-ray images. The model identifies
            disease patterns and generates probability scores for each condition.
          </p>

          <ul className="space-y-3 text-slate-600">
            <li>• Image normalization & preprocessing</li>
            <li>• Feature extraction via deep CNN layers</li>
            <li>• Multi-class disease classification</li>
            <li>• Confidence scoring (0–1 probability)</li>
            <li>• Grad-CAM heatmap generation</li>
            <li>• Optional voice-based AI summary</li>
          </ul>
        </div>
      </section>

      {/* ================= REPORTS ================= */}
      <section id="reports" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-10">Reports</h2>

        <p className="text-slate-600 mb-8">
          Rayzo generates structured diagnostic reports including:
        </p>

        <ul className="space-y-2 text-slate-600 mb-12">
          <li>• Detected Diseases (Pneumonia, Effusion, Atelectasis, No Finding)</li>
          <li>• Severity Level (NORMAL, MILD, MODERATE, SEVERE)</li>
          <li>• AI Confidence Score</li>
          <li>• Grad-CAM Visual Highlight</li>
          <li>• Voice AI Report</li>
          <li>• Doctor Notes & Diagnosis</li>
        </ul>

        {/* Report Image Placeholder */}
        <div className="rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <img
            src="/report-example.png"
            alt="Report Example"
            className="w-full"
          />
        </div>
      </section>

      {/* ================= ABOUT TEAM ================= */}
      <section id="about" className="relative py-32 px-6 bg-gradient-to-br from-slate-50 via-blue-50/40 to-red-50/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20">Meet the Team</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14">

            {[
              {
                name: "Aviral Vishwakarma",
                role: "Frontend & Backend Integration",
                github: "https://github.com/aviralVishwakarma",
                linkedin: "https://www.linkedin.com/in/aviralvishwakarma/",
                img: "src/images/team1.png"
              },
              {
                name: "Sahil Chaturvedi",
                role: "Backend Engineer",
                github: "#",
                linkedin: "#",
                img: "src/images/team2.png"
              },
              {
                name: "Avatansh Mishra",
                role: "ML Engineer",
                github: "#",
                linkedin: "#",
                img: "/team3.png"
              },
              {
                name: "MO Zaid",
                role: "ML and Blockchain Engineer",
                github: "#",
                linkedin: "#",
                img: "src/images/team4.png"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="relative p-10 rounded-3xl backdrop-blur-xl bg-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition duration-500"
              >
                {/* Animated Gradient Ring */}
                <div className="relative w-44 h-44 mx-auto mb-6 group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-spin-slow"></div>

                  <div className="absolute inset-1 rounded-full bg-white"></div>

                  <img
                    src={member.img}
                    alt={member.name}
                    className="relative w-44 h-44 rounded-full object-cover z-10 transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-xl font-semibold">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-sm text-slate-500 mt-2 mb-5">
                  {member.role}
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-6 text-xl">
                  <a
                    href={member.github}
                    target="_blank"
                    className="text-gray-700 hover:text-black transition"
                  >
                    <Github size={24} />
                  </a>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Linkedin size={24} />
                  </a>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  )
}