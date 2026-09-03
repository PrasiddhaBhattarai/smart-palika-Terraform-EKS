import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiMail, FiPhone } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-nepal-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              {/* <div className="bg-white p-2 rounded-lg">
                <FiHeart className="h-6 w-6 text-nepal-red" />
              </div> */}
              <div className="p-1 rounded-lg">
                            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                          </div>
              <span className="ml-3 text-xl font-bold">Smart Palika</span>
            </div>
            <p className="text-blue-100 max-w-md">
              A citizen-centric platform to report and track civic issues across Nepal. 
              Join thousands of citizens making Nepal a better place to live.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-blue-100 hover:text-white transition duration-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/submit-complaint" className="text-blue-100 hover:text-white transition duration-300">
                  File Complaint
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="text-blue-100 hover:text-white transition duration-300">
                  My Complaints
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-blue-100 mr-3" />
                <span className="text-blue-100">info@smartpalika.gov.np</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-blue-100 mr-3" />
                <span className="text-blue-100">+977 1 1234567</span>
              </div>
              <div className="flex items-center">
                <FiGithub className="h-5 w-5 text-blue-100 mr-3" />
                <a 
                  href="https://github.com/smart-palika" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition duration-300"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blue-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm">
            © 2024 Smart Palika. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-blue-100 hover:text-white transition duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white transition duration-300 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-white transition duration-300 text-sm">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;