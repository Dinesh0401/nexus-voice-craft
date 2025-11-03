import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User, Mail, Phone, GraduationCap, Settings, LogOut, LayoutDashboard, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './navigation/MobileNav';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New connection request from Dr. Sarah', time: '2 hours ago', read: false },
    { id: 2, message: 'Your mentorship session is tomorrow', time: '1 day ago', read: false },
    { id: 3, message: 'New forum reply', time: '2 days ago', read: true },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  const handleNotificationClick = (id: number) => {
    console.log('Notification clicked:', id);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <a href="mailto:info@kit.edu" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">info@kit.edu</span>
            </a>
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">+1 (234) 567-890</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Knowledge Institute of Technology</h1>
              <p className="text-xs text-muted-foreground">Alumni Network</p>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? <>
                {/* Notification Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                      <Bell className="h-5 w-5" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        {notifications.filter(n => !n.read).length} unread
                      </p>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className={`px-4 py-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </> : <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAuthDialog(true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Join as Student
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-md"
                >
                  Login
                </Button>
              </>}
          </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-muted" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto">
          <DesktopNav isActive={isActive} />
          <MobileNav 
            isOpen={isMenuOpen} 
            user={user} 
            isAuthenticated={isAuthenticated} 
            handleLogout={handleLogout} 
            navigate={navigate} 
            isActive={isActive} 
          />
        </div>
      </div>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <AuthDialog 
          triggerText="" 
          triggerClassName="hidden"
          defaultTab="login"
        />
      )}
    </header>;
};

export default Header;
