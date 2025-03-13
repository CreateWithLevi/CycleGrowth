import Link from "next/link";
import { ArrowUpRight, Check, RefreshCcw } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Meet{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Cyclo
                </span>
                , Your Growth Evolution Assistant
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Navigate your personal growth journey with an AI assistant that
                evolves as you do, guiding you through cycles of planning,
                execution, analysis, and improvement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
                >
                  Start Your Growth Cycle
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                >
                  How It Works
                </Link>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Personalized guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Evolving AI assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Continuous improvement</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative w-[320px] h-[320px] mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse opacity-20"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse opacity-30"></div>
                <div className="absolute inset-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                    <RefreshCcw className="h-20 w-20 text-white" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg">
                  <RefreshCcw
                    className="w-6 h-6 text-purple-600 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
