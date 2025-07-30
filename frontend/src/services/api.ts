const API_BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export interface PersonalInfo {
  id?: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website?: string;
  resumeUrl?: string | null;
  resumeType?: 'file' | 'link' | null;
  resumeName?: string | null;
  resumeSize?: string | null;
  uploadDate?: Date | string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoLink: string;
  githubLink: string;
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

class ApiService {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
    };
  }

  private getPublicHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If parsing fails, use the default message
      }
      throw new Error(errorMessage);
    }
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return {} as T;
  }

  // Personal Info API
  async getPersonalInfo(): Promise<PersonalInfo | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/personal`);
      return this.handleResponse<PersonalInfo>(response);
    } catch (error) {
      console.error('Error fetching personal info:', error);
      throw error;
    }
  }

  async updatePersonalInfo(data: Partial<PersonalInfo>): Promise<PersonalInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/personal`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<PersonalInfo>(response);
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  }

  // Projects API
  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      return this.handleResponse<Project[]>(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async addProject(data: Omit<Project, 'id'>): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async toggleProjectFeatured(id: string, featured: boolean): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/featured`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ featured }),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Error toggling project featured status:', error);
      throw error;
    }
  }

  // Skills API
  async getSkills(): Promise<Skill[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills`);
      return this.handleResponse<Skill[]>(response);
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  }

  async addSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<Skill>(response);
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<Skill>(response);
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }

  async toggleSkillFeatured(id: string, featured: boolean): Promise<Skill> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/${id}/feature`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ featured }),
      });
      return this.handleResponse<Skill>(response);
    } catch (error) {
      console.error('Error toggling skill featured status:', error);
      throw error;
    }
  }

  // Contact Messages API
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse<ContactMessage[]>(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async toggleMessageRead(id: string, read: boolean): Promise<ContactMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}/read`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ read }),
      });
      return this.handleResponse<ContactMessage>(response);
    } catch (error) {
      console.error('Error toggling message read status:', error);
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Reply to messages via email
  async replyToMessage(id: string, replyMessage: string, subject: string): Promise<{ message: string; emailSent: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}/reply`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          replyMessage, 
          subject 
        }),
      });
      return this.handleResponse<{ message: string; emailSent: boolean }>(response);
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  }

  // Public contact form submission
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: this.getPublicHeaders(),
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          read: false,
        }),
      });
      return this.handleResponse<ContactMessage>(response);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

  // Password Management API
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return this.handleResponse<{ status: string; timestamp: string }>(response);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Resume management
  async uploadResume(file: File): Promise<{
  message: string;
  resumeUrl: string;
  resumeInfo: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
    resumeType: string;
  };
  }> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_BASE_URL}/personal/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
        },
        body: formData,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  async addResumeLink(resumeUrl: string): Promise<{
    message: string;
    resumeUrl: string;
    resumeInfo: {
      fileName: string;
      uploadDate: string;
      resumeType: string;
    };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/resume/link`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ resumeUrl }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error adding resume link:', error);
      throw error;
    }
  }

  async deleteResume(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/resume`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();