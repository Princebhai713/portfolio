import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Prince</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Full Stack Developer passionate about creating exceptional digital experiences 
              with modern web technologies and clean, efficient code.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/prince-yadav001" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-social-github"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/prince-yadav-portfolio/" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-social-linkedin"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/princebhai45" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-social-twitter"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:pb6620113@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-social-email"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("#about")}
                  data-testid="footer-nav-about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#projects")}
                  data-testid="footer-nav-projects"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#blog")}
                  data-testid="footer-nav-blog"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#contact")}
                  data-testid="footer-nav-contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Web Development</span></li>
              <li><span className="text-gray-400">API Development</span></li>
              <li><span className="text-gray-400">UI/UX Design</span></li>
              <li><span className="text-gray-400">Consulting</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Prince. All rights reserved. Built with ❤️ using React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}