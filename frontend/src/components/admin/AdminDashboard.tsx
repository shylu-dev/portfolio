import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  TrendingUp, 
  Eye,
  Star,
  Mail,
  Loader2
} from 'lucide-react';
import { useProjects, useSkills, useContactMessages } from '@/hooks/useData';

interface AdminDashboardProps {
  onTabChange?: (tab: string) => void;
}

export const AdminDashboard = ({ onTabChange }: AdminDashboardProps) => {
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useContactMessages();

  const isLoading = projectsLoading || skillsLoading || messagesLoading;

  const stats = useMemo(() => [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      change: `${projects.filter(p => p.featured).length} featured`,
      icon: FolderOpen,
      color: "text-primary"
    },
    {
      title: "Skills",
      value: skills.length.toString(),
      change: `${skills.filter(s => s.featured).length} featured`,
      icon: Settings,
      color: "text-secondary-foreground"
    },
    {
      title: "Messages",
      value: messages.length.toString(),
      change: `${messages.filter(m => !m.read).length} unread`,
      icon: MessageSquare,
      color: "text-accent-foreground"
    },
    {
      title: "Technologies",
      value: new Set(projects.flatMap(p => p.techStack)).size.toString(),
      change: "across all projects",
      icon: Eye,
      color: "text-primary"
    }
  ], [projects, skills, messages]);

  const recentActivities = useMemo(() => {
    const activities = [];

    // Recent messages
    const recentMessages = messages
      .filter(m => !m.read)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 2);

    recentMessages.forEach(message => {
      activities.push({
        action: "New message received",
        details: `From: ${message.email}`,
        time: new Date(message.timestamp).toLocaleDateString(),
        icon: Mail,
        type: "message"
      });
    });

    // Recent featured projects
    const featuredProjects = projects.filter(p => p.featured).slice(0, 2);
    featuredProjects.forEach(project => {
      activities.push({
        action: "Featured project",
        details: `${project.title} - ${project.techStack.slice(0, 2).join(', ')}`,
        time: "Recently updated",
        icon: FolderOpen,
        type: "project"
      });
    });

    // Featured skills
    const featuredSkills = skills.filter(s => s.featured).slice(0, 1);
    featuredSkills.forEach(skill => {
      activities.push({
        action: "Featured skill",
        details: `${skill.name} added to portfolio`,
        time: "Recently added",
        icon: Settings,
        type: "skill"
      });
    });

    // Portfolio analytics
    activities.push({
      action: "Portfolio metrics",
      details: `${projects.length} projects, ${skills.length} skills showcased`,
      time: "Current status",
      icon: TrendingUp,
      type: "analytics"
    });

    return activities.slice(0, 4);
  }, [projects, skills, messages]);

  const quickActions = [
    { 
      label: "Add New Project", 
      action: "projects", 
      icon: FolderOpen,
      description: "Create and manage projects"
    },
    { 
      label: "Update Skills", 
      action: "skills", 
      icon: Settings,
      description: "Add or edit your skills"
    },
    { 
      label: "Check Messages", 
      action: "contacts", 
      icon: MessageSquare,
      description: "View contact messages",
      badge: messages.filter(m => !m.read).length > 0 ? messages.filter(m => !m.read).length : null
    },
    { 
      label: "Edit Profile", 
      action: "personal", 
      icon: Users,
      description: "Update personal information"
    }
  ];

  const handleQuickAction = (action: string) => {
    if (onTabChange) {
      onTabChange(action);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-xs">Start by adding projects or skills!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 text-left group hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors relative">
                      <action.icon className="h-5 w-5 text-primary" />
                      {action.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Health Check */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Portfolio Health Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${projects.length >= 3 ? 'text-green-500' : 'text-yellow-500'}`}>
                {projects.length >= 3 ? '✅' : '⚠️'}
              </div>
              <p className="text-sm font-medium mb-1">Projects</p>
              <p className="text-xs text-muted-foreground">
                {projects.length >= 3 ? 'Good portfolio diversity' : 'Consider adding more projects'}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${skills.filter(s => s.featured).length >= 5 ? 'text-green-500' : 'text-yellow-500'}`}>
                {skills.filter(s => s.featured).length >= 5 ? '✅' : '⚠️'}
              </div>
              <p className="text-sm font-medium mb-1">Featured Skills</p>
              <p className="text-xs text-muted-foreground">
                {skills.filter(s => s.featured).length >= 5 ? 'Great skill showcase' : 'Feature more key skills'}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${messages.filter(m => !m.read).length === 0 ? 'text-green-500' : 'text-blue-500'}`}>
                {messages.filter(m => !m.read).length === 0 ? '✅' : '📧'}
              </div>
              <p className="text-sm font-medium mb-1">Messages</p>
              <p className="text-xs text-muted-foreground">
                {messages.filter(m => !m.read).length === 0 ? 'All caught up!' : `${messages.filter(m => !m.read).length} unread messages`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};