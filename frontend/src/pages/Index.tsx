import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { EducationSection } from '@/components/EducationSection';
import { InternshipSection } from '@/components/InternshipSection';
import { ThemeToggle } from '@/components/ThemeToggle';


const Index = () => {
  
  // Optimize reveal elements on scroll with useCallback
  const handleScroll = useCallback(() => {
    const reveals = document.querySelectorAll('.reveal');
    
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check on initial load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ThemeToggle />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <InternshipSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </motion.div>
  );
};

export default React.memo(Index);