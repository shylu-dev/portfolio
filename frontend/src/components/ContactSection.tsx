import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiService, PersonalInfo } from '../services/api';

export const ContactSection = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await apiService.getPersonalInfo();
        setPersonalInfo(data);
      } catch (error) {
        console.error('Error fetching personal info:', error);
        // Fallback data
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
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await apiService.submitContactForm(formData);
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact me directly.');
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-indigo-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {personalInfo?.bio || 
                "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and development."
                }
              </p>
            </div>

            <div className="space-y-6">
              {personalInfo?.email && (
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Email</h4>
                    <a 
                      href={`mailto:${personalInfo.email}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {personalInfo?.phone && (
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Phone</h4>
                    <a 
                      href={`tel:${personalInfo.phone}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {personalInfo?.location && (
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">{personalInfo.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {personalInfo?.github && (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-700 dark:hover:bg-gray-600 transform hover:scale-110 transition-all duration-300"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {personalInfo?.linkedin && (
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transform hover:scale-110 transition-all duration-300"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {personalInfo?.website && (
                  <a
                    href={personalInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-300"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Send Message
            </h3>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-300 text-sm">{submitMessage}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 text-sm">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Project collaboration, job opportunity, etc."
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full"
                  placeholder="Tell me about your project or how I can help you..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};