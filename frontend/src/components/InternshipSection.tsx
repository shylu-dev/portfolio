// import React, { useRef, useEffect } from 'react';
// import { Briefcase } from 'lucide-react';
// import { motion, Variants } from 'framer-motion';

// // Internship data
// const internships = [
//   {
//     company: 'Kennametal',
//     role: 'Project Intern',
//     duration: 'Mar 2024 - Aug 2024',
//     description: 'Automated Adobe Illustrator scripting with AI integration, reducing design time by 40%. Enhanced design workflow precision and utilized Python and ExtendScript frameworks.'
//   },
//   {
//     company: 'Gully Sales',
//     role: 'Intern',
//     duration: 'Feb 2025 - May 2025',
//     description: 'Worked on multiple projects from scratch, including gathering requirements, designing system architecture, and building scalable web solutions to meet business needs.'
//   },
//   {
//     company: 'GenEd Technologies',
//     role: 'Project Intern',
//     duration: 'Oct 2022 - Dec 2022',
//     description: 'Built drone and robotics systems from scratch, improving prototype reliability by 25%. Worked with Arduino, ROS, and Python for automation and control.'
//   },
// ];

// interface Internship {
//   company: string;
//   role: string;
//   duration: string;
//   description: string;
// }

// interface InternshipCardProps {
//   internship: Internship;
//   index: number;
// }

// // Internship card component
// const InternshipCard: React.FC<InternshipCardProps> = ({ internship, index }) => {
//   const cardVariants: Variants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         delay: index * 0.2,
//         type: "spring",
//         stiffness: 100,
//         damping: 12
//       }
//     }
//   };
  
//   return (
//     <motion.div
//       variants={cardVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.1 }}
//       className="glass-morphism rounded-2xl p-6 h-full flex flex-col shadow-lg hover:shadow-glow/20 transition-all duration-300 transform hover:-translate-y-2"
//     >
//       <div className="flex items-center gap-3 mb-4">
//         <motion.div
//           className="w-10 h-10 bg-glow/10 flex items-center justify-center rounded-full"
//           whileHover={{ scale: 1.2, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
//         >
//           <Briefcase className="text-glow" size={22} />
//         </motion.div>
//         <div>
//           <h4 className="font-bold text-lg text-white">{internship.company}</h4>
//           <div className="text-glow text-sm">{internship.role}</div>
//         </div>
//       </div>
//       <div className="text-sm text-gray-300 mb-2">{internship.duration}</div>
//       <div className="text-gray-400">{internship.description}</div>
//     </motion.div>
//   );
// };

// const InternshipSectionComponent: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
  
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('active');
//         }
//       },
//       { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
//     );
    
//     const currentRef = sectionRef.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }
    
//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, []);

//   return (
//     <section id="internships" className="section-padding bg-dark/95">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <motion.h2
//             className="text-3xl md:text-4xl font-display font-bold mb-2"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             <span className="text-glow">Internships</span>
//           </motion.h2>
//           <motion.div
//             className="w-24 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto"
//             initial={{ width: 0 }}
//             whileInView={{ width: 96 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.7 }}
//           />
//         </div>

//         <div ref={sectionRef} className="reveal grid gap-6 md:grid-cols-3">
//           {internships.map((internship, idx) => (
//             <InternshipCard
//               key={`${internship.company}-${idx}`}
//               internship={internship}
//               index={idx}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export const InternshipSection = React.memo(InternshipSectionComponent);

import React, { useRef, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// Internship data
const internships = [
  {
    company: 'Kennametal',
    role: 'Project Intern',
    duration: 'Mar 2024 - Aug 2024',
    description: 'Automated Adobe Illustrator scripting with AI integration, reducing design time by 40%. Enhanced design workflow precision and utilized Python and ExtendScript frameworks.'
  },
  {
    company: 'Gully Sales',
    role: 'Intern',
    duration: 'Feb 2025 - May 2025',
    description: 'Worked on multiple projects from scratch, including gathering requirements, designing system architecture, and building scalable web solutions to meet business needs.'
  },
  {
    company: 'GenEd Technologies',
    role: 'Project Intern',
    duration: 'Oct 2022 - Dec 2022',
    description: 'Built drone and robotics systems from scratch, improving prototype reliability by 25%. Worked with Arduino, ROS, and Python for automation and control.'
  },
];

interface Internship {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface InternshipCardProps {
  internship: Internship;
  index: number;
}

// Internship card component
const InternshipCard: React.FC<InternshipCardProps> = ({ internship, index }) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 12
      } 
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col border border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 border border-purple-300/30 flex items-center justify-center rounded-full"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <Briefcase className="text-purple-600 dark:text-purple-400" size={22} />
        </motion.div>
        <div>
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{internship.company}</h4>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm font-medium">{internship.role}</div>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">{internship.duration}</div>
      <div className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{internship.description}</div>
    </motion.div>
  );
};

const InternshipSectionComponent: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      }, 
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => { 
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="internships" className="py-20 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-5xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Internships
          </motion.h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional experience and learning journey
          </p>
        </div>

        <div ref={sectionRef} className="reveal grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {internships.map((internship, idx) => (
            <InternshipCard 
              key={`${internship.company}-${idx}`}
              internship={internship} 
              index={idx} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const InternshipSection = React.memo(InternshipSectionComponent);