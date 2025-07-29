import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, ExternalLink, Github, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useData';


export const ProjectsManager = () => {
  const { 
    projects, 
    loading, 
    error, 
    addProject, 
    updateProject, 
    deleteProject, 
    toggleProjectFeatured 
  } = useProjects();

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    techStack: '',
    demoLink: '',
    githubLink: '',
    featured: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        image: newProject.image || '🚀',
        techStack: newProject.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
        demoLink: newProject.demoLink,
        githubLink: newProject.githubLink,
        featured: newProject.featured
      };
      
      await addProject(projectData);
      setNewProject({
        title: '',
        description: '',
        image: '',
        techStack: '',
        demoLink: '',
        githubLink: '',
        featured: false
      });
      setShowAddForm(false);
      
      toast({
        title: "Project added successfully! 🎉",
        description: `${projectData.title} has been added to your portfolio.`,
      });
    } catch (error) {
      toast({
        title: "Error adding project",
        description: error instanceof Error ? error.message : "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id);
    setEditForm({
      ...project,
      techStack: [...project.techStack]
    });
  };

  const handleUpdateProject = async () => {
    if (!editForm) return;
    
    try {
      setIsSubmitting(true);
      await updateProject(editForm.id, editForm);
      setEditingProject(null);
      setEditForm(null);
      
      toast({
        title: "Project updated! ✨",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating project",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const project = projects.find(p => p.id === id);
    
    try {
      await deleteProject(id);
      toast({
        title: "Project removed",
        description: `${project?.title} has been removed from your portfolio.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleProjectFeatured(id);
      toast({
        title: "Featured status updated",
        description: "Project featured status has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error updating featured status",
        description: error instanceof Error ? error.message : "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading projects</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Projects Management</h2>
          <p className="text-muted-foreground">Manage your portfolio projects and showcase your work.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectImage">Icon/Emoji</Label>
                <Input
                  id="projectImage"
                  value={newProject.image}
                  onChange={(e) => setNewProject(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="🚀"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description *</Label>
              <Textarea
                id="projectDescription"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project, its features, and what makes it special..."
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectTechStack">Tech Stack (comma-separated)</Label>
              <Input
                id="projectTechStack"
                value={newProject.techStack}
                onChange={(e) => setNewProject(prev => ({ ...prev, techStack: e.target.value }))}
                placeholder="React, Node.js, Express, MongoDB"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectDemo">Demo Link</Label>
                <Input
                  id="projectDemo"
                  value={newProject.demoLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, demoLink: e.target.value }))}
                  placeholder="https://demo.example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectGithub">GitHub Link</Label>
                <Input
                  id="projectGithub"
                  value={newProject.githubLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubLink: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newProject.featured}
                  onCheckedChange={(checked) => setNewProject(prev => ({ ...prev, featured: checked }))}
                />
                <Label className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Featured project</span>
                </Label>
              </div>
              
              <div className="space-x-2">
                <Button onClick={handleAddProject} disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Project
                    </>
                  )}
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {projects.map(project => (
          <Card key={project.id} className="glass-card">
            <CardContent className="p-6">
              {editingProject === project.id && editForm ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Title</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon/Emoji</Label>
                      <Input
                        value={editForm.image}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, image: e.target.value } : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tech Stack (comma-separated)</Label>
                    <Input
                      value={editForm.techStack.join(', ')}
                      onChange={(e) => setEditForm(prev => prev ? { 
                        ...prev, 
                        techStack: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                      } : null)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Demo Link</Label>
                      <Input
                        value={editForm.demoLink}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, demoLink: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub Link</Label>
                      <Input
                        value={editForm.githubLink}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, githubLink: e.target.value } : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.featured}
                        onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, featured: checked } : null)}
                      />
                      <Label>Featured project</Label>
                    </div>
                    
                    <div className="space-x-2">
                      <Button onClick={handleUpdateProject} disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button onClick={() => setEditingProject(null)} variant="outline" disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{project.image}</div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-2">
                          <span>{project.title}</span>
                          {project.featured && <Star className="h-4 w-4 text-primary fill-current" />}
                        </h3>
                        <div className="flex space-x-2 mt-1">
                          {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                               className="text-primary hover:underline text-sm flex items-center space-x-1">
                              <ExternalLink className="h-3 w-3" />
                              <span>Demo</span>
                            </a>
                          )}
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                               className="text-primary hover:underline text-sm flex items-center space-x-1">
                              <Github className="h-3 w-3" />
                              <span>Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(project.id)}
                      >
                        {project.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground">Add your first project to get started!</p>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-foreground">{projects.filter(p => p.featured).length}</div>
              <p className="text-sm text-muted-foreground">Featured Projects</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-foreground">
                {new Set(projects.flatMap(p => p.techStack)).size}
              </div>
              <p className="text-sm text-muted-foreground">Technologies Used</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};