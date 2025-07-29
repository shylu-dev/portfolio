import { useState, useEffect } from 'react';
import { Save, Edit2, MapPin, Mail, Phone, Github, Linkedin, Upload, Link, FileText, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePersonalInfo } from '@/hooks/useData';
import { apiService } from '@/services/api';

export const PersonalInfoManager = () => {
  const { personalInfo, loading, error, updatePersonalInfo, refetch } = usePersonalInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeLink, setResumeLink] = useState('');
  const [tempInfo, setTempInfo] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });
  const { toast } = useToast();

  // Update tempInfo when personalInfo changes
  useEffect(() => {
    if (personalInfo) {
      setTempInfo({
        name: personalInfo.name || '',
        title: personalInfo.title || '',
        bio: personalInfo.bio || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedin: personalInfo.linkedin || '',
        github: personalInfo.github || '',
        website: personalInfo.website || ''
      });
    }
  }, [personalInfo]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePersonalInfo(tempInfo);
      setIsEditing(false);
      toast({
        title: "Personal information updated! ✨",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: error instanceof Error ? error.message : "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (personalInfo) {
      setTempInfo({
        name: personalInfo.name || '',
        title: personalInfo.title || '',
        bio: personalInfo.bio || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedin: personalInfo.linkedin || '',
        github: personalInfo.github || '',
        website: personalInfo.website || ''
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploadingResume(true);
      const response = await apiService.uploadResume(file);
      
      // Refetch personal info to get updated resume data
      await refetch();
      
      toast({
        title: "Resume uploaded successfully! 📄",
        description: `${response.resumeInfo.fileName} has been uploaded.`,
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload resume",
        variant: "destructive"
      });
    } finally {
      setIsUploadingResume(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleLinkSubmit = async () => {
    if (!resumeLink.trim()) return;

    try {
      new URL(resumeLink);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploadingResume(true);
      const response = await apiService.addResumeLink(resumeLink);
      
      // Refetch personal info to get updated resume data
      await refetch();
      setResumeLink('');
      
      toast({
        title: "Resume link added! 🔗",
        description: "Resume link has been saved successfully.",
      });
    } catch (error) {
      console.error('Resume link error:', error);
      toast({
        title: "Failed to add link",
        description: error instanceof Error ? error.message : "Failed to add resume link",
        variant: "destructive"
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleRemoveResume = async () => {
    try {
      setIsUploadingResume(true);
      await apiService.deleteResume();
      
      // Refetch personal info to get updated resume data
      await refetch();
      
      toast({
        title: "Resume removed",
        description: "Resume has been removed successfully.",
      });
    } catch (error) {
      console.error('Resume deletion error:', error);
      toast({
        title: "Failed to remove resume",
        description: error instanceof Error ? error.message : "Failed to remove resume",
        variant: "destructive"
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleViewResume = () => {
    if (personalInfo?.resumeUrl) {
      window.open(personalInfo.resumeUrl, '_blank');
    } else {
      toast({
        title: "No resume available",
        description: "Please upload a resume first.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString.toString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading personal information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading personal information</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const hasResume = personalInfo?.resumeUrl;
  const resumeInfo = personalInfo ? {
    fileName: personalInfo.resumeName || 'Resume',
    fileSize: personalInfo.resumeSize || '',
    uploadDate: formatDate(personalInfo.uploadDate),
    resumeType: personalInfo.resumeType || 'file'
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Personal Information</h2>
          <p className="text-muted-foreground">Manage your basic profile information and contact details.</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="btn-primary">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
              {isSaving ? (
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
            <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={isEditing ? tempInfo.name : personalInfo?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={isEditing ? tempInfo.title : personalInfo?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={isEditing ? tempInfo.bio : personalInfo?.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className={!isEditing ? "bg-muted/50 resize-none" : "resize-none"}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={isEditing ? tempInfo.email : personalInfo?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </Label>
              <Input
                id="phone"
                value={isEditing ? tempInfo.phone : personalInfo?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                value={isEditing ? tempInfo.location : personalInfo?.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Social & Professional Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center space-x-2">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Label>
                <Input
                  id="linkedin"
                  value={isEditing ? tempInfo.linkedin : personalInfo?.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Label>
                <Input
                  id="github"
                  value={isEditing ? tempInfo.github : personalInfo?.github || ''}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload Section with Backend Integration */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Resume</span>
              </div>
              {hasResume && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewResume}
                  className="flex items-center space-x-1"
                  disabled={isUploadingResume}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Current Resume</span>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasResume && resumeInfo ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">{resumeInfo.fileName}</p>
                      <div className="flex items-center space-x-4 text-sm text-green-600 dark:text-green-400">
                        {resumeInfo.fileSize && <span>{resumeInfo.fileSize}</span>}
                        {resumeInfo.uploadDate && <span>Uploaded on {resumeInfo.uploadDate}</span>}
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                          {resumeInfo.resumeType === 'file' ? 'File' : 'Link'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveResume}
                    disabled={isUploadingResume}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                  >
                    {isUploadingResume ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Remove
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold">Update Resume</h4>
                    <Badge variant="secondary">Replace current resume</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Upload from Device</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploadingResume ? (
                            <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          )}
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              {isUploadingResume ? 'Uploading...' : 'Click to upload'}
                            </span> 
                            {!isUploadingResume && ' or drag and drop'}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF or Word documents (MAX. 5MB)</p>
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          disabled={isUploadingResume}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Add Resume Link</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="https://drive.google.com/file/d/... or any resume link"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        disabled={isUploadingResume}
                      />
                      <Button 
                        onClick={handleLinkSubmit} 
                        disabled={!resumeLink.trim() || isUploadingResume}
                      >
                        {isUploadingResume ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4 mr-1" />
                        )}
                        Add Link
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can paste links from Google Drive, Dropbox, or any publicly accessible resume link
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No Resume Uploaded</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your resume to showcase your experience and qualifications
                  </p>
                  <Badge variant="outline">Resume Required</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold">Upload Resume</h4>
                    <Badge variant="secondary">Choose your preferred method</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Upload from Device</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="resume-upload-initial" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploadingResume ? (
                            <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          )}
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              {isUploadingResume ? 'Uploading...' : 'Click to upload'}
                            </span>
                            {!isUploadingResume && ' or drag and drop'}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF or Word documents (MAX. 5MB)</p>
                        </div>
                        <input
                          id="resume-upload-initial"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          disabled={isUploadingResume}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Add Resume Link</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="https://drive.google.com/file/d/... or any resume link"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        disabled={isUploadingResume}
                      />
                      <Button 
                        onClick={handleLinkSubmit} 
                        disabled={!resumeLink.trim() || isUploadingResume}
                      >
                        {isUploadingResume ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4 mr-1" />
                        )}
                        Add Link
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can paste links from Google Drive, Dropbox, or any publicly accessible resume link
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};