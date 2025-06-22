
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MapPin, Star, ArrowRight, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sahaara-warm via-background to-sahaara-earth">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sahaara-gradient rounded-lg flex items-center justify-center">
            <Handshake className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold sahaara-text-gradient">Sahaara</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/tasks" className="text-muted-foreground hover:text-primary transition-colors">Browse Tasks</Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="sahaara-gradient text-white hover:opacity-90 transition-opacity" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-slideIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="sahaara-text-gradient">Choti Madad,</span>
            <br />
            <span className="text-foreground">Gehri Pehchaan</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Connect with your neighbors for small tasks that build lasting relationships. 
            From fixing a device to buying groceries, find help and offer support in your local community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="sahaara-gradient text-white hover:opacity-90 transition-opacity text-lg px-8 py-6" asChild>
              <Link to="/tasks">
                Browse Tasks <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/post-task">Post a Task</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How Sahaara Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building community connections through simple acts of kindness
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 sahaara-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Find Local Help</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Discover people in your neighborhood who are ready to help with tasks big and small.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 sahaara-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Connect Safely</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Chat securely and exchange contact info only when both parties agree to help.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 sahaara-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                <Star className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Build Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Rate and review helpers to build a trusted community network that grows stronger together.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Stats */}
      <section className="bg-card/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold sahaara-text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold sahaara-text-gradient mb-2">200+</div>
              <div className="text-muted-foreground">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold sahaara-text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">Neighborhoods</div>
            </div>
            <div>
              <div className="text-4xl font-bold sahaara-text-gradient mb-2">4.8★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start helping your community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of neighbors who are building stronger communities, one small act of kindness at a time.
          </p>
          <Button size="lg" className="sahaara-gradient text-white hover:opacity-90 transition-opacity text-lg px-12 py-6" asChild>
            <Link to="/register">
              Join Sahaara Today <Heart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 sahaara-gradient rounded-md flex items-center justify-center">
                <Handshake className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold sahaara-text-gradient">Sahaara</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Sahaara. Building communities through kindness.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
