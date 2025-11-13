"use client"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Code2, Users, Zap, Globe, Terminal, FileCode, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Write code in JavaScript, Python, Java, C++, HTML, CSS, and more with intelligent syntax highlighting.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-Time Collaboration",
      description: "Code together with your team in real-time. See cursors, selections, and changes instantly.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileCode className="w-8 h-8" />,
      title: "Smart File Explorer",
      description: "Organize your projects with folders and files. Create, rename, and manage your workspace effortlessly.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Integrated Terminal",
      description: "Built-in terminal panel for running commands, testing code, and managing your development workflow.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Powered by WebSockets and Yjs for instant synchronization and seamless collaboration experience.",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Work Anywhere",
      description: "Access your projects from any device, anywhere. Cloud-based and always available.",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>


      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 mb-8">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-300">Next-Gen Collaborative IDE</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
          Code Together,
          <br />
          <span className="text-blue-500">Build Better</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate collaborative coding platform with real-time synchronization, 
          multi-language support, and powerful features to supercharge your development workflow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push('/projects')}
            className="group px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-semibold text-lg text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 font-semibold text-lg border border-slate-700 text-gray-300"
          >
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">
              11+
            </div>
            <div className="text-gray-400 text-sm">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">
              Real-Time
            </div>
            <div className="text-gray-400 text-sm">Collaboration</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">
              Cloud-Based
            </div>
            <div className="text-gray-400 text-sm">Always Available</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg">Everything you need for modern collaborative coding</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className={`inline-flex p-3 rounded-xl bg-blue-600 mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="relative rounded-3xl bg-blue-600 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start Coding?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join CodeBro today and experience the future of collaborative development
            </p>
            <button
              onClick={() => router.push('/projects')}
              className="group px-10 py-5 rounded-xl bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:scale-105 inline-flex items-center gap-3"
            >
              Start Coding Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 border-t border-slate-800 text-center text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code2 className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-white">CodeBro</span>
        </div>
        <p className="text-sm">Built with ❤️ for developers who love to collaborate</p>
      </footer>
    </div>
  );
}
