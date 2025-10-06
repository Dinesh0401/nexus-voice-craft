import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './navigation/MobileNav';
import { Calendar, MessageSquare, UserPlus } from 'lucide-react';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const isMobile = useIsMobile();
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  return <header className="shadow-lg">
      {/* Top Contact Bar */}
      <div className="gradient-header py-3 px-4 text-xs md:text-sm text-white font-medium shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span className="flex items-center hover:text-yellow-300 transition-colors cursor-pointer">
              📞 ALUMNI ADMIN: +91 98947 01234
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-yellow-300 transition-colors cursor-pointer">
              ✉️ info@kiot.ac.in
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-4 md:px-8">
          {/* Enhanced Logo Section */}
          <Link to="/" className="flex items-center group hover:scale-105 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-4 md:gap-5 mx-0 px-0 my-0 py-0 rounded-sm bg-slate-50">
              <div className="relative">
                <img src="/lovable-uploads/2f632a9a-d04b-476f-ad3d-4ad3ca35b5e5.png" alt="Knowledge Institute of Technology" className="h-20 md:h-24 w-auto object-contain drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text leading-tight glow-text text-transparent text-center font-semibold md:text-6xl">
                  Knowledge
                </span>
                <span className="text-lg md:text-xl font-semibold text-foreground/80">
                  Institute of Technology
                </span>
                <span className="flex items-center gap-1 text-sm md:text-base text-primary font-medium mt-0.5">
                  <span>🎓</span> Alumni Association
                </span>
              </div>
            </div>
          </Link>
        
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated && user ? <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-nexus-primary/10 transition-all duration-200">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 shadow-lg border-0 bg-white">
                  <DropdownMenuLabel className="text-nexus-primary font-semibold">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[{
                  title: "New mentor connection",
                  description: "Dr. Anand Sharma accepted your request",
                  time: "2 hours ago",
                  icon: UserPlus,
                  iconClass: "text-green-500"
                }, {
                  title: "Upcoming mock interview",
                  description: "Tomorrow at 3:00 PM with Sarah Johnson",
                  time: "1 day ago",
                  icon: Calendar,
                  iconClass: "text-blue-500"
                }, {
                  title: "New forum reply",
                  description: "Someone replied to your post about career advice",
                  time: "2 days ago",
                  icon: MessageSquare,
                  iconClass: "text-purple-500"
                }].map((notification, index) => <DropdownMenuItem key={index} className="flex items-start py-3 px-4 cursor-pointer hover:bg-nexus-primary/5">
                      <div className={`rounded-full p-2 ${notification.iconClass} bg-gray-100 mr-3`}>
                        <notification.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-500">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-nexus-primary font-medium hover:bg-nexus-primary/10">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 rounded-full flex items-center gap-3 pl-2 pr-4 hover:bg-nexus-primary/10 transition-all duration-200 border border-transparent hover:border-nexus-primary/20">
                    <Avatar className="h-9 w-9 ring-2 ring-nexus-primary/20">
                      {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.fullName || 'User'} /> : <AvatarFallback className="bg-gradient-to-br from-nexus-primary to-blue-600 text-white font-semibold">
                          {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : (user.email || 'U').substring(0, 2).toUpperCase()}
                        </AvatarFallback>}
                    </Avatar>
                    <span className="font-medium text-sm text-gray-700 hidden lg:inline">
                      {user.fullName ? user.fullName.split(' ')[0] : user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 shadow-lg border-0" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-nexus-primary/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/alumni')} className="hover:bg-nexus-primary/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600">
                    <User className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : <div className="flex items-center gap-2">
              <AuthDialog triggerText="JOIN AS STUDENT" triggerClassName="gradient-button text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110" defaultTab="register" />
              <AuthDialog triggerText="JOIN AS ALUMNI" triggerClassName="gradient-accent text-gray-900 font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110" defaultTab="register" />
              <AuthDialog triggerText="LOGIN" triggerClassName="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 hover:brightness-110" defaultTab="login" />
            </div>}
        </div>
        
          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground hover:text-primary p-2 rounded-lg hover:bg-muted transition-all duration-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <DesktopNav isActive={isActive} />
          <MobileNav isOpen={isMenuOpen} user={user} isAuthenticated={isAuthenticated} handleLogout={handleLogout} navigate={navigate} isActive={isActive} />
        </div>
      </div>
    </header>;
};
export default Header;