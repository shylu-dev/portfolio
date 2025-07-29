import React, { useEffect, useState } from 'react';
import { apiService, Skill } from '../services/api'; // Adjust the path if needed

export const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await apiService.getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      {/* Include Devicons CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
      />

      <section
        id="skills"
        className="py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-indigo-950/50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A collection of technologies I'm passionate about and continuously improving
            </p>
          </div>

          {/* Animated Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group relative flex flex-col items-center p-6 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/30 hover:border-white/60 transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-2 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glowing background effect */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300 blur-xl"
              ></div>



                {/* Icon with animation */}
                <div className="relative text-4xl mb-3 group-hover:animate-bounce">
                  <i className={skill.icon}></i>
                </div>

                {/* Skill name */}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {skill.name}
                </span>

                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Specialty Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/30 hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <i className="devicon-html5-plain text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Frontend Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Creating beautiful, responsive user interfaces with modern frameworks and attention to detail.
              </p>
            </div>

            <div className="group bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/30 hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <i className="devicon-nodejs-plain text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Backend Power
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Building robust, scalable server-side applications with efficient database management.
              </p>
            </div>

            <div className="group bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/30 hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <i className="devicon-git-plain text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Full Stack
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Seamlessly connecting frontend and backend to create complete, polished applications.
              </p>
            </div>
          </div>
        </div>

        {/* CSS for animations */}
        <style>{`
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default SkillsSection;