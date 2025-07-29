import React, { useState, useEffect } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiService, PersonalInfo } from '../services/api';

export const HeroSection = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeDownloading, setResumeDownloading] = useState(false);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await apiService.getPersonalInfo();
        setPersonalInfo(data);
      } catch (error) {
        console.error('Error fetching personal info:', error);
        // Fallback data in case of error
        setPersonalInfo({
          name: 'Shylaja',
          title: 'Full-Stack Developer',
          bio: '',
          email: 'shylajagowda15703@gmail.com',
          phone: '',
          location: '',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          website: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeDownload = async () => {
    if (!personalInfo?.resumeUrl) {
      alert('Resume not available for download');
      return;
    }

    setResumeDownloading(true);
    
    try {
      if (personalInfo.resumeType === 'link') {
        // If it's a link, open in new tab
        window.open(personalInfo.resumeUrl, '_blank');
      } else {
        // If it's a file URL, download it
        const response = await fetch(personalInfo.resumeUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch resume');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Use the actual resume name from backend or fallback to a default name
        const fileName = personalInfo.resumeName || `${personalInfo.name || 'Resume'}.pdf`;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setResumeDownloading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)`
             }}>
        </div>
      </div>

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-purple-300/20 dark:text-purple-400/20 font-mono text-sm animate-float-slow">
          {'<code/>'}
        </div>
        <div className="absolute top-40 right-32 text-pink-300/20 dark:text-pink-400/20 font-mono text-sm animate-float-slow" style={{animationDelay: '2s'}}>
          {'{ passion: true }'}
        </div>
        <div className="absolute bottom-32 left-32 text-indigo-300/20 dark:text-indigo-400/20 font-mono text-sm animate-float-slow" style={{animationDelay: '4s'}}>
          {'console.log("✨")'}
        </div>
        <div className="absolute bottom-20 right-20 text-purple-300/20 dark:text-purple-400/20 font-mono text-sm animate-float-slow" style={{animationDelay: '1s'}}>
          {'const dreams = []'}
        </div>
      </div>

      {/* Simple Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-40 text-2xl opacity-40 animate-float-gentle">✨</div>
        <div className="absolute bottom-40 left-40 text-2xl opacity-40 animate-float-gentle" style={{animationDelay: '3s'}}>💫</div>
        <div className="absolute top-1/2 left-20 text-2xl opacity-40 animate-float-gentle" style={{animationDelay: '1.5s'}}>🌸</div>
        <div className="absolute top-1/3 right-20 text-2xl opacity-40 animate-float-gentle" style={{animationDelay: '4.5s'}}>💎</div>
      </div>

      {/* Subtle Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/30 dark:to-pink-800/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-indigo-200/20 dark:from-pink-800/20 dark:to-indigo-800/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Available for opportunities</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Hi, I'm {personalInfo?.name?.split(' ')[0] || 'Shylaja'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A passionate 
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold mx-2">
              full-stack developer
            </span>
            who creates beautiful, functional applications with modern technologies ✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleResumeDownload}
              disabled={!personalInfo?.resumeUrl || resumeDownloading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {resumeDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {personalInfo?.resumeType === 'link' ? 'Opening...' : 'Downloading...'}
                </>
              ) : (
                <>
                  {personalInfo?.resumeUrl ? 'Download Resume' : 'Resume Not Available'}
                  {personalInfo?.resumeUrl && (
                    <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                  )}
                </>
              )}
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-purple-700 dark:text-purple-300 hover:bg-white/30 dark:hover:bg-white/20 rounded-full px-8 py-3 font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            {personalInfo?.github && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {personalInfo?.linkedin && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {personalInfo?.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>

      {/* Simple CSS for animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.3;
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
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
  );
};