import { useState, useEffect, useCallback } from 'react';
import { apiService, PersonalInfo, Project, Skill, ContactMessage } from '../services/api';

// Personal Info Hook
export const usePersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPersonalInfo();
      setPersonalInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personal info');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePersonalInfo = useCallback(async (data: Partial<PersonalInfo>) => {
    try {
      const updated = await apiService.updatePersonalInfo(data);
      setPersonalInfo(updated);
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update personal info';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchPersonalInfo();
  }, [fetchPersonalInfo]);

  return {
    personalInfo,
    loading,
    error,
    updatePersonalInfo,
    refetch: fetchPersonalInfo,
  };
};

// Projects Hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (data: Omit<Project, 'id'>) => {
    try {
      const newProject = await apiService.addProject(data);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updatedProject = await apiService.updateProject(id, data);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await apiService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const toggleProjectFeatured = useCallback(async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      
      const updatedProject = await apiService.toggleProjectFeatured(id, !project.featured);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle project featured status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectFeatured,
    refetch: fetchProjects,
  };
};

// Skills Hook
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSkills();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSkill = useCallback(async (data: Omit<Skill, 'id'>) => {
    try {
      const newSkill = await apiService.addSkill(data);
      setSkills(prev => [...prev, newSkill]);
      return newSkill;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateSkill = useCallback(async (id: string, data: Partial<Skill>) => {
    try {
      const updatedSkill = await apiService.updateSkill(id, data);
      setSkills(prev => prev.map(s => s.id === id ? updatedSkill : s));
      return updatedSkill;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      await apiService.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete skill';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const toggleSkillFeatured = useCallback(async (id: string) => {
    try {
      const skill = skills.find(s => s.id === id);
      if (!skill) throw new Error('Skill not found');
      
      const updatedSkill = await apiService.toggleSkillFeatured(id, !skill.featured);
      setSkills(prev => prev.map(s => s.id === id ? updatedSkill : s));
      return updatedSkill;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle skill featured status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [skills]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillFeatured,
    refetch: fetchSkills,
  };
};

// Contact Messages Hook
export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMessageRead = useCallback(async (id: string) => {
    try {
      const message = messages.find(m => m.id === id);
      if (!message) throw new Error('Message not found');
      
      const updatedMessage = await apiService.toggleMessageRead(id, !message.read);
      setMessages(prev => prev.map(m => m.id === id ? updatedMessage : m));
      return updatedMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle message read status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [messages]);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await apiService.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // New function to reply to messages via email
  const replyToMessage = useCallback(async (id: string, replyMessage: string, subject: string) => {
    try {
      const response = await apiService.replyToMessage(id, replyMessage, subject);
      
      // Mark message as read after successful reply
      const message = messages.find(m => m.id === id);
      if (message && !message.read) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reply';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [messages]);

  const submitContactForm = useCallback(async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      const newMessage = await apiService.submitContactForm(data);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit contact form';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    toggleMessageRead,
    deleteMessage,
    replyToMessage, // New function
    submitContactForm,
    refetch: fetchMessages,
  };
};

// Export types for reuse
export type { PersonalInfo, Project, Skill, ContactMessage };