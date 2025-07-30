import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Filter, Search, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiService, Project } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedTech, setSelectedTech] = useState('All Technologies');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch projects on component mount
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

  // Get all unique technologies from projects
  const allTechnologies = React.useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(project => {
      project.techStack.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects]);

  // Filter projects based on selected technology and search query
  useEffect(() => {
    // Only filter when we have projects loaded
    if (projects.length === 0) {
      setFilteredProjects([]);
      return;
    }

    let filtered = projects;

    // Filter by technology
    if (selectedTech !== 'All Technologies') {
      filtered = filtered.filter(project => 
        project.techStack.includes(selectedTech)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedTech, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-6">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore my portfolio of projects that demonstrate my passion for building
              innovative solutions and my expertise in various technologies.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Technology Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedTech === 'All Technologies' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTech('All Technologies')}
              className={selectedTech === 'All Technologies' ? 'btn-primary' : ''}
            >
              All Technologies
            </Button>
            {allTechnologies.map((tech) => (
              <Button
                key={tech}
                variant={selectedTech === tech ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTech(tech)}
                className={selectedTech === tech ? 'btn-primary' : ''}
              >
                {tech}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedTech !== 'All Technologies' && (
              <span> filtered by <strong>{selectedTech}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong>{searchQuery}</strong>"</span>
            )}
          </p>
        </div>

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card bg-card p-6 rounded-lg border"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{project.image || '📁'}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.featured && (
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-primary fill-current" />
                        <span className="text-sm text-primary font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSelectedTech(tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {project.demoLink && (
                    <Button asChild size="sm" className="btn-primary">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.githubLink && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedTech !== 'All Technologies' ? (
                <>
                  Try adjusting your search criteria or{' '}
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTech('All Technologies');
                    }}
                    className="text-primary hover:underline"
                  >
                    clear all filters
                  </button>
                </>
              ) : (
                'No projects available at the moment.'
              )}
            </p>
          </div>
        )}

        {/* Project Stats - Centered Footer */}
        {projects.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-12 text-center max-w-2xl">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">{projects.length}</div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-foreground mb-2">
                    {allTechnologies.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Technologies Used</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {projects.filter(p => p.demoLink && p.githubLink).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Complete Projects</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;