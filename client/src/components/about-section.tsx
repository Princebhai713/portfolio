import { useEffect, useRef, useState } from "react";

interface SkillData {
  name: string;
  level: number;
  description: string;
  color: string;
}

const skills: SkillData[] = [
  {
    name: "Frontend Development",
    level: 90,
    description: "React, TypeScript, Tailwind CSS, Next.js",
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Backend Development", 
    level: 85,
    description: "Node.js, Express, RESTful APIs, GraphQL",
    color: "from-purple-500 to-green-500"
  },
  {
    name: "Database & ORM",
    level: 80,
    description: "PostgreSQL, MongoDB, Drizzle ORM, Prisma", 
    color: "from-green-500 to-blue-500"
  },
  {
    name: "DevOps & Tools",
    level: 75,
    description: "Docker, AWS, Vercel, Git, CI/CD",
    color: "from-blue-500 to-green-500"
  }
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Passionate developer with expertise in modern web technologies and a drive for creating innovative solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Journey</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              I'm a passionate full-stack developer with over 3 years of experience building web applications. 
              My journey started with curiosity about how websites work, and it has evolved into a deep love 
              for creating exceptional digital experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              I specialize in React, TypeScript, Node.js, and modern web technologies. I'm always eager to 
              learn new technologies and take on challenging projects that push the boundaries of what's possible.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
              alt="Modern developer workspace with multiple monitors" 
              className="rounded-xl shadow-lg w-full h-64 object-cover" 
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Technical Skills</h3>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name} data-testid={`skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${skill.color} h-3 rounded-full skill-bar transition-all duration-1000 ease-out`}
                      style={{ 
                        width: isVisible ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{skill.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education & Certifications</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white">Computer Science Degree</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">University Name • 2020-2024</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white">AWS Certified Developer</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Amazon Web Services • 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
