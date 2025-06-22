import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Handshake, Plus, MapPin, Clock, DollarSign, Star, MessageCircle, Users, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description: string;
  location: string;
  reward: string;
  type: 'money' | 'favor' | 'barter';
  timePosted: string;
  poster: string;
  rating: number;
  postedByCurrentUser?: boolean;
  status?: 'available' | 'accepted' | 'completed';
  acceptedBy?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
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
    
    // Load user's posted tasks from localStorage
    const storedTasks = localStorage.getItem('sahaara_user_tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      const userSpecificTasks = tasks.filter((task: Task) => task.poster === parsedUser.name);
      setUserTasks(userSpecificTasks);
    }

    // Check location permission
    checkLocationPermission();
  }, [navigate]);

  const checkLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state === 'granted');
      });
    }
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLocationPermission(true);
        toast({
          title: "Location Access Granted",
          description: "Your location will be shared when you accept tasks.",
        });
      } catch (error) {
        toast({
          title: "Location Access Denied",
          description: "Location sharing won't be available for task coordination.",
          variant: "destructive",
        });
      }
    }
  };

  const shareLocation = async (taskId: number) => {
    if (!locationPermission) {
      const shouldRequest = window.confirm("Location sharing helps coordinate with task partners. Enable location access?");
      if (shouldRequest) {
        await requestLocationPermission();
      }
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      toast({
        title: "Location Shared",
        description: `Your location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) has been shared with your task partner.`,
      });
      
      // In a real app, this would send location to the backend
      console.log(`Location shared for task ${taskId}:`, { latitude, longitude });
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('sahaara_user');
    navigate('/');
  };

  const sampleTasks: Task[] = [
    {
      id: 1,
      title: "Help with grocery shopping",
      description: "Need someone to pick up groceries from the local market. I can pay for the groceries + a small tip.",
      location: "Sector 15, Gurgaon",
      reward: "₹200",
      type: "money",
      timePosted: "2 hours ago",
      poster: "Priya S.",
      rating: 4.8
    },
    {
      id: 2,
      title: "Fix my laptop screen",
      description: "Laptop screen is flickering. Looking for someone who knows laptop repairs.",
      location: "DLF Phase 2",
      reward: "Favor exchange",
      type: "favor",
      timePosted: "4 hours ago",
      poster: "Rahul K.",
      rating: 4.9
    },
    {
      id: 3,
      title: "Tutor my kid in Math",
      description: "Need a tutor for 8th grade mathematics. 2-3 sessions per week.",
      location: "Cyber City",
      reward: "₹500/session",
      type: "money",
      timePosted: "1 day ago",
      poster: "Meera A.",
      rating: 5.0
    }
  ];

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
              <Link to="/tasks">
                <Button variant="ghost">Browse Tasks</Button>
              </Link>
              <Link to="/post-task">
                <Button className="sahaara-gradient text-white hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Task
                </Button>
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

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {user.location}
          </p>
          
          {/* Location Permission Status */}
          <div className="mt-4 flex items-center space-x-2">
            <Navigation className={`w-4 h-4 ${locationPermission ? 'text-green-500' : 'text-orange-500'}`} />
            <span className="text-sm text-muted-foreground">
              Location sharing: {locationPermission ? 'Enabled' : 'Disabled'}
            </span>
            {!locationPermission && (
              <Button variant="outline" size="sm" onClick={requestLocationPermission}>
                Enable
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 sahaara-gradient rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Tasks Helped</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 sahaara-gradient rounded-lg flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 sahaara-gradient rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Chats</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 sahaara-gradient rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹2,400</p>
                <p className="text-sm text-muted-foreground">Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Tasks Near You</h2>
              <Link to="/tasks">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {sampleTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1">{task.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{task.poster}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            {task.rating}
                          </div>
                        </div>
                      </div>
                      <Badge variant={task.type === 'money' ? 'default' : 'secondary'}>
                        {task.reward}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">{task.description}</CardDescription>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {task.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.timePosted}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        className="flex-1 sahaara-gradient text-white hover:opacity-90"
                        onClick={() => shareLocation(task.id)}
                      >
                        Sahaara Karu! 🤝
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Your Posted Tasks</h2>
            {userTasks.length > 0 ? (
              <div className="space-y-4">
                {userTasks.map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-sahaara-warm">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg mb-1">{task.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {task.status || 'Available'}
                          </Badge>
                        </div>
                        <Badge variant={task.type === 'money' ? 'default' : 'secondary'}>
                          {task.reward}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="mb-3">{task.description}</CardDescription>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {task.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.timePosted}
                        </div>
                      </div>
                      {task.acceptedBy && (
                        <div className="text-sm text-green-600 mb-2">
                          ✅ Accepted by {task.acceptedBy}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit Task
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 sahaara-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-2">No tasks posted yet</CardTitle>
                  <CardDescription className="mb-4">
                    Post your first task and get help from your community
                  </CardDescription>
                  <Link to="/post-task">
                    <Button className="sahaara-gradient text-white hover:opacity-90">
                      Post Your First Task
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
