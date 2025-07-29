import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService, Project } from '../services/api';

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 gradient-text">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and creative solutions
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className={`project-card animate-fade-in-up`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{project.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-primary fill-current" />
                        <span className="text-sm text-primary font-medium">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Button asChild size="sm" className="btn-primary">
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-muted-foreground">Other Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {otherProjects.map((project, index) => (
                <div key={project.id} className="project-card animate-fade-in-up" style={{animationDelay: `${(featuredProjects.length + index) * 0.1}s`}}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{project.image}</div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Demo
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild className="btn-secondary">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};