import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail, Download, ArrowRight } from "lucide-react";

export function HeroSection() {
  const scrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const downloadResume = () => {
    // TODO: Implement resume download functionality
    console.log("Download resume functionality would be implemented here");
  };

  return (
    <section id="home" className="pt-16 min-h-screen flex items-center hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Hi, I'm <span className="text-blue-600 dark:text-blue-400">Prince</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-8">
                Full Stack Developer & Tech Enthusiast
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
                I craft exceptional digital experiences through clean code and innovative solutions. 
                Passionate about modern web technologies, React, TypeScript, and building products that matter.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button 
                  onClick={scrollToProjects}
                  data-testid="button-view-work"
                  className="btn-primary text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={downloadResume}
                  data-testid="button-download-resume"
                  className="border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>

              <div className="flex space-x-6 mb-8">
                <a 
                  href="https://github.com/prince-yadav001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="hero-social-github"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-200"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/prince-yadav-portfolio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="hero-social-linkedin"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-200"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a 
                  href="https://x.com/princebhai45" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="hero-social-twitter"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-200"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a 
                  href="mailto:pb6620113@gmail.com" 
                  data-testid="hero-social-email"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-200"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="https://i.postimg.cc/nzvhZ05j/IMG-20250130-WA0002-removebg-preview-2.png" 
                alt="Professional developer portrait" 
                className="rounded-full w-80 h-80 object-cover shadow-2xl border-8 border-white dark:border-gray-700" 
              />
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-lg">
                <i className="fas fa-code text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}