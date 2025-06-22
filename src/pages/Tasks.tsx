import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Handshake, MapPin, Clock, DollarSign, Star, MessageCircle, Search, Filter, Navigation } from 'lucide-react';
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
}

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
  },
  {
    id: 4,
    title: "Dog walking service",
    description: "Need someone to walk my dog twice a day. He's very friendly and well-behaved.",
    location: "Golf Course Road",
    reward: "₹300/day",
    type: "money",
    timePosted: "3 hours ago",
    poster: "Amit T.",
    rating: 4.7
  },
  {
    id: 5,
    title: "Help with moving furniture",
    description: "Moving some furniture within the apartment. Need 2-3 people for help.",
    location: "MG Road",
    reward: "Pizza + ₹150 each",
    type: "barter",
    timePosted: "5 hours ago",
    poster: "Neha P.",
    rating: 4.6
  }
];

const Tasks = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const userData = localStorage.getItem('sahaara_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Check location permission
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state === 'granted');
      });
    }
  }, [navigate]);

  const requestLocationAndAcceptTask = async (task: Task) => {
    if (!locationPermission) {
      const shouldRequest = window.confirm(
        `To accept "${task.title}", you'll need to share your location with ${task.poster} for coordination. Enable location access?`
      );
      
      if (shouldRequest) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setLocationPermission(true);
          shareLocationAndAcceptTask(task);
        } catch (error) {
          toast({
            title: "Location Access Required",
            description: "Location sharing is needed to coordinate with task posters.",
            variant: "destructive",
          });
          return;
        }
      } else {
        return;
      }
    } else {
      shareLocationAndAcceptTask(task);
    }
  };

  const shareLocationAndAcceptTask = (task: Task) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      
      // Simulate both users sharing location
      toast({
        title: "🤝 Task Accepted!",
        description: `Location shared with ${task.poster}. You can now coordinate directly!`,
      });

      // In a real app, this would:
      // 1. Notify the task poster
      // 2. Share both users' locations
      // 3. Enable direct messaging
      console.log(`Task ${task.id} accepted. Your location:`, { latitude, longitude });
      console.log(`Task poster ${task.poster} will be notified and locations will be shared.`);
      
      // Show a follow-up toast with next steps
      setTimeout(() => {
        toast({
          title: "Next Steps",
          description: `Message ${task.poster} to coordinate the details. Location sharing is active.`,
        });
      }, 2000);
    }, (error) => {
      toast({
        title: "Location Error",
        description: "Could not get your location. Please try again.",
        variant: "destructive",
      });
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('sahaara_user');
    navigate('/');
  };

  // Load user's posted tasks and merge with sample tasks
  const userTasks = JSON.parse(localStorage.getItem('sahaara_user_tasks') || '[]');
  const allTasks = [...sampleTasks, ...userTasks.filter((task: Task) => task.poster !== user?.name)];

  const filteredTasks = allTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Link to="/post-task">
                <Button className="sahaara-gradient text-white hover:opacity-90">
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
        {/* Search and Filter Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Browse Tasks Near You</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, locations, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Location Status */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
            <Navigation className={`w-4 h-4 ${locationPermission ? 'text-green-500' : 'text-orange-500'}`} />
            <span>
              Location sharing: {locationPermission ? 'Ready for task coordination' : 'Will be requested when accepting tasks'}
            </span>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
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
                <CardDescription className="mb-4 text-base">{task.description}</CardDescription>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {task.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {task.timePosted}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 sahaara-gradient text-white hover:opacity-90"
                    onClick={() => requestLocationAndAcceptTask(task)}
                  >
                    Sahaara Karu! 🤝
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tasks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
