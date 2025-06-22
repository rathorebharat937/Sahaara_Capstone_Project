
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Handshake, MapPin, DollarSign, Gift, Repeat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PostTask = () => {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reward, setReward] = useState('');
  const [rewardType, setRewardType] = useState<'money' | 'favor' | 'barter'>('money');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('sahaara_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Pre-fill location with user's location
    setLocation(parsedUser.location || '');
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !reward) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to post your task.",
        variant: "destructive",
      });
      return;
    }

    const newTask = {
      id: Date.now(), // Simple ID generation
      title,
      description,
      location,
      reward,
      type: rewardType,
      timePosted: 'Just now',
      poster: user.name,
      rating: user.rating || 5.0,
      postedByCurrentUser: true,
      status: 'available'
    };

    // Save to localStorage
    const existingTasks = JSON.parse(localStorage.getItem('sahaara_user_tasks') || '[]');
    const updatedTasks = [...existingTasks, newTask];
    localStorage.setItem('sahaara_user_tasks', JSON.stringify(updatedTasks));

    console.log('Task posted:', newTask);

    toast({
      title: "Task Posted Successfully! 🎉",
      description: "Your task is now visible to the community.",
    });

    // Reset form
    setTitle('');
    setDescription('');
    setReward('');
    setRewardType('money');

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('sahaara_user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sahaara-warm via-background to-sahaara-earth">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sahaara-gradient rounded-lg flex items-center justify-center">
                <Handshake className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold sahaara-text-gradient">Sahaara</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/tasks">
                <Button variant="ghost">Browse Tasks</Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="sahaara-gradient text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Task</h1>
          <p className="text-muted-foreground">
            Share your task with the community and get help from your neighbors
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Provide clear information about what help you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Help with grocery shopping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what help you need in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Your area/neighborhood"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reward-type">Reward Type *</Label>
                  <Select value={rewardType} onValueChange={(value: 'money' | 'favor' | 'barter') => setRewardType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="money">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Money
                        </div>
                      </SelectItem>
                      <SelectItem value="favor">
                        <div className="flex items-center">
                          <Gift className="w-4 h-4 mr-2" />
                          Favor Exchange
                        </div>
                      </SelectItem>
                      <SelectItem value="barter">
                        <div className="flex items-center">
                          <Repeat className="w-4 h-4 mr-2" />
                          Barter/Exchange
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward">Reward/Payment *</Label>
                  <Input
                    id="reward"
                    placeholder={
                      rewardType === 'money' 
                        ? "e.g., ₹200" 
                        : rewardType === 'favor'
                        ? "e.g., Return favor"
                        : "e.g., Home-cooked meal"
                    }
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {title || "Your task title will appear here"}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{user.name}</span>
                          <div className="flex items-center">
                            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-1" />
                            {user.rating || 5.0}
                          </div>
                        </div>
                      </div>
                      <Badge variant={rewardType === 'money' ? 'default' : 'secondary'}>
                        {reward || "Reward"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">
                      {description || "Your task description will appear here..."}
                    </CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location || "Location"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button type="submit" className="w-full sahaara-gradient text-white hover:opacity-90">
                Post Task 🚀
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostTask;
