import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MessageCircle, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="gradient-header text-white pt-12 pb-6 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Logo & About */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-white text-nexus-primary flex items-center justify-center font-display text-xl mx-[7px] my-0 px-[13px] py-0">Kiot</div>
              <span className="text-xl font-display font-semibold text-white">AluminiKiot</span>
            </Link>
            <p className="text-sm text-white/80 mb-4">
              Connecting alumni-building futures, and fostering lifelong relationships.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <Shield className="h-4 w-4" />
              <span>Your data is yours—always encrypted and never shared.</span>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/about">About us</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Column 3 - Programs */}
          <div>
            <h3 className="font-medium text-white mb-4">Programs</h3>
            <ul className="space-y-2">
              <FooterLink to="/mentorship">Mentorship</FooterLink>
              <FooterLink to="/mock-interviews">Mock Interviews</FooterLink>
              <FooterLink to="/events">Networking Events</FooterLink>
              <FooterLink to="/resources">Career Resources</FooterLink>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-medium text-white mb-4">Contact us</h3>
            <ul className="space-y-2">
              <li className="text-sm flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <a href="mailto:contact@alumnexus.com" className="text-white hover:underline">contact@alumnexus.com</a>
              </li>
              <li className="text-sm flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+1555123457" className="text-white hover:underline">(555) 123-4567</a>
              </li>
              <li className="text-sm flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-white">Salem</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Proof */}
        <div className="border-t border-white/20 pt-6 text-center text-sm text-white/80">
          <p>Join 2,500+ alumni and 10,000+ students already connecting on alumNexus.</p>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} alumNexus. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
const FooterLink = ({
  to,
  children
}: {
  to: string;
  children: React.ReactNode;
}) => <li>
    <Link to={to} className="text-sm text-white hover:text-white/80 transition-colors">
      {children}
    </Link>
  </li>;
export default Footer;