
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export const NavLink = ({ to, children, isActive = false }: { to: string; children: React.ReactNode; isActive?: boolean }) => (
  <Link 
    to={to}
    className={cn(
      "text-white font-medium px-4 py-3 hover:bg-blue-800 transition-colors inline-block",
      isActive && "bg-blue-800"
    )}
  >
    {children}
  </Link>
);

export const NavDropdown = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="text-white font-medium px-4 py-3 hover:bg-blue-800 transition-colors flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full bg-white text-gray-800 shadow-md rounded-b-md min-w-48 z-10">
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to}
    className="block px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
  >
    {children}
  </Link>
);

// Export a simple list of navigation links for use in MobileNav
export type NavLinkItem = { name: string; href: string };

export const navLinks: NavLinkItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'AI Features', href: '/ai-demo' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Mentorship', href: '/mentorship' },
  { name: 'Mock Interviews', href: '/mock-interviews' },
  { name: 'Forum', href: '/forum' },
  { name: 'Alumni', href: '/alumni' },
  { name: 'Hubs', href: '/hubs' },
  { name: 'Contact', href: '/contact' },
];
