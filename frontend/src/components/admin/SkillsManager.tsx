import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, BarChart3, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSkills } from '@/hooks/useData';


export const SkillsManager = () => {
  const {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillFeatured
  } = useSkills();

  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkill, setNewSkill] = useState({
    name: '',
    icon: '',
    featured: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addSkill(newSkill);
      setNewSkill({ name: '', icon: '', featured: false });
      setShowAddForm(false);
      
      toast({
        title: "Skill added successfully! 🎉",
        description: `${newSkill.name} has been added to your skills.`,
      });
    } catch (error) {
      toast({
        title: "Error adding skill",
        description: error instanceof Error ? error.message : "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill.id);
    setEditForm({ ...skill });
  };

  const handleUpdateSkill = async () => {
    if (!editForm) return;
    
    try {
      setIsSubmitting(true);
      await updateSkill(editForm.id, editForm);
      setEditingSkill(null);
      setEditForm(null);
      
      toast({
        title: "Skill updated! ✨",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating skill",
        description: error instanceof Error ? error.message : "Failed to update skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const skill = skills.find(s => s.id === id);
    
    try {
      await deleteSkill(id);
      toast({
        title: "Skill removed",
        description: `${skill?.name} has been removed from your skills.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting skill",
        description: error instanceof Error ? error.message : "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleSkillFeatured(id);
      toast({
        title: "Featured status updated",
        description: "Skill featured status has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error updating featured status",
        description: error instanceof Error ? error.message : "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  // Filter skills based on search term
  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading skills</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Skills Management</h2>
            <p className="text-muted-foreground">Add, edit, and organize your technical skills.</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {showAddForm && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Add New Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skillName">Skill Name *</Label>
                  <Input
                    id="skillName"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., JavaScript"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skillIcon">Devicon Class</Label>
                  <Input
                    id="skillIcon"
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="e.g., devicon-javascript-original colored"
                  />
                  <p className="text-sm text-muted-foreground">
                    Get icons at{' '}
                    <a
                      href="https://devicon.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Devicons
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSkill.featured}
                    onCheckedChange={(checked) => setNewSkill(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Featured on portfolio</span>
                  </Label>
                </div>
                
                <div className="space-x-2">
                  <Button onClick={handleAddSkill} disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Skill
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Skills ({filteredSkills.length})</span>
              <Badge variant="outline">{filteredSkills.filter(s => s.featured).length} featured</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? `No skills found matching "${searchTerm}"` : 'No skills added yet'}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSkills.map(skill => (
                  <div key={skill.id} className="skill-card p-4 rounded-lg border bg-card">
                    {editingSkill === skill.id && editForm ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Skill Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon Class</Label>
                          <Input
                            value={editForm.icon}
                            onChange={(e) => setEditForm(prev => prev ? { ...prev, icon: e.target.value } : null)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editForm.featured}
                            onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, featured: checked } : null)}
                          />
                          <Label>Featured</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleUpdateSkill} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)} disabled={isSubmitting}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <i className={`${skill.icon} text-xl`}></i>
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {skill.featured && (
                              <Star className="h-4 w-4 text-primary fill-current" />
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSkill(skill)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleFeatured(skill.id)}
                            className="text-xs w-full"
                          >
                            {skill.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Skills Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{skills.length}</div>
                <p className="text-sm text-muted-foreground">Total Skills</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-foreground">{skills.filter(s => s.featured).length}</div>
                <p className="text-sm text-muted-foreground">Featured Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
