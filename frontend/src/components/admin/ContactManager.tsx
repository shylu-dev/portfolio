import { useState } from 'react';
import { 
  Mail, MessageSquare, Clock, User, Reply, Trash2, Eye, EyeOff, 
  Loader2, Send, Check, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useContactMessages, ContactMessage } from '@/hooks/useData';

export const ContactManager = () => {
  const { messages, loading, error, toggleMessageRead, deleteMessage, replyToMessage } = useContactMessages();
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const { toast } = useToast();

  const handleToggleReadStatus = async (id: string) => {
    try {
      await toggleMessageRead(id);
      const message = messages.find(m => m.id === id);
      toast({
        title: message?.read ? "Marked as unread" : "Marked as read",
        description: `Message from ${message?.name}`,
      });
    } catch (error) {
      toast({
        title: "Error updating message",
        description: error instanceof Error ? error.message : "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const message = messages.find(m => m.id === id);
      await deleteMessage(id);
      toast({
        title: "Message deleted",
        description: `Message from ${message?.name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting message",
        description: error instanceof Error ? error.message : "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReplyToMessage = async () => {
    if (!selectedContact || !replyMessage.trim() || !replySubject.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingReply(true);
    
    try {
      await replyToMessage(selectedContact.id, replyMessage, replySubject);
      
      toast({
        title: "Reply sent successfully! 📧",
        description: `Your reply to ${selectedContact.name} has been sent via email.`,
      });
      
      setReplyMessage('');
      setReplySubject('');
      setSelectedContact(null);
    } catch (error) {
      toast({
        title: "Failed to send reply",
        description: error instanceof Error ? error.message : "Could not send email reply",
        variant: "destructive",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const openReplyDialog = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setReplySubject(`Re: ${contact.subject}`);
    setReplyMessage('');
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.read;
    if (filter === 'read') return message.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">Error loading messages</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Contact Messages</h2>
          <p className="text-muted-foreground">Manage messages from your portfolio contact form.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={unreadCount > 0 ? "default" : "secondary"}>
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({messages.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
          size="sm"
        >
          Read ({messages.length - unreadCount})
        </Button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map(contact => (
          <Card key={contact.id} className={`glass-card transition-all hover:shadow-lg ${!contact.read ? 'border-primary/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center space-x-2">
                        <span>{contact.name}</span>
                        {!contact.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="ml-13">
                    <h4 className="font-medium mb-2">{contact.subject}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                      {contact.message}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(contact.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => openReplyDialog(contact)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View & Reply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Mail className="h-5 w-5" />
                          <span>Message from {contact.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Original Message */}
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.email}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(contact.timestamp)}</p>
                          </div>
                          <h3 className="font-semibold mb-2">{contact.subject}</h3>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                        </div>
                        
                        {/* Reply Section */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center space-x-2">
                            <Reply className="h-4 w-4" />
                            <span>Send Email Reply</span>
                          </h4>
                          
                          <Alert>
                            <Check className="h-4 w-4" />
                            <AlertDescription>
                              Your reply will be sent directly to {contact.email} and the message will be marked as read.
                            </AlertDescription>
                          </Alert>

                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="reply-subject">Subject</Label>
                              <Input
                                id="reply-subject"
                                value={replySubject}
                                onChange={(e) => setReplySubject(e.target.value)}
                                placeholder="Reply subject..."
                                disabled={isSendingReply}
                              />
                            </div>
                            <div>
                              <Label htmlFor="reply-message">Message</Label>
                              <Textarea
                                id="reply-message"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply here..."
                                rows={6}
                                disabled={isSendingReply}
                                className="resize-none"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedContact(null)}
                              disabled={isSendingReply}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleReplyToMessage} 
                              className="btn-primary"
                              disabled={isSendingReply || !replyMessage.trim() || !replySubject.trim()}
                            >
                              {isSendingReply ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Reply
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleReadStatus(contact.id)}
                    title={contact.read ? "Mark as unread" : "Mark as read"}
                  >
                    {contact.read ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteMessage(contact.id)}
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' 
                ? "All messages have been read!" 
                : filter === 'read' 
                ? "No read messages yet." 
                : "You haven't received any messages yet."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Message Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{messages.length}</div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-foreground">{unreadCount}</div>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-foreground">{messages.length - unreadCount}</div>
              <p className="text-sm text-muted-foreground">Read</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {messages.filter(c => c.subject.toLowerCase().includes('job') || c.subject.toLowerCase().includes('opportunity')).length}
              </div>
              <p className="text-sm text-muted-foreground">Opportunities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};