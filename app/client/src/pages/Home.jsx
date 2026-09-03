// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { 
  FiAlertTriangle, 
  FiMap, 
  FiPhone, 
  FiClock, 
  FiUserCheck,
  FiArrowRight,
  FiMapPin,
  FiUser
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const nepalMap = new URL('../assets/nepal-map.jpg', import.meta.url).href;

const Home = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <FiAlertTriangle className="w-8 h-8" />,
      title: 'Report Issues',
      description: 'Report civic issues quickly and efficiently using our platform'
    },
    {
      icon: <FiMap className="w-8 h-8" />,
      title: 'Track Status',
      description: 'Track your complaint status in real-time with our dashboard'
    },
    {
      icon: <FiPhone className="w-8 h-8" />,
      title: 'Get Notified',
      description: 'Receive SMS and email notifications on complaint updates'
    },
    {
      icon: <FiUserCheck className="w-8 h-8" />,
      title: 'Verified Officials',
      description: 'Your complaints are handled by verified government officials'
    }
  ];

  const testimonials = [
    {
      name: "Ranjit Acharya",
      role: "Citizen, Kathmandu",
      content: "This portal helped resolve our garbage collection issue in just 3 days. The status updates kept us informed throughout the process.",
    },
    {
      name: "Prasidhha Bhattarai",
      role: "Local Business Owner",
      content: "Reporting the damaged road near my shop was so easy. The municipality fixed it within a week after I submitted the complaint.",
    },
    {
      name: "Janak Duwadi",
      role: "Community Leader",
      content: "The transparency in complaint tracking has increased citizen trust in local governance. A revolutionary platform for Nepal!",
    }
  ];

  // Initial stats - will be updated with API data
  const [stats, setStats] = useState([
    { value: 35, suffix: "", label: "Citizens Registered" },
    { value: 2, suffix: "", label: "Complaints Resolved" },
    { value: 32, suffix: "", label: "Wards Active" },
    { value: 92, suffix: "%", label: "Satisfaction Rate" }
  ]);

  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(stats.map(stat => ({...stat, animatedValue: 0})));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Fetch user count from API
  // useEffect(() => {
  //   const fetchUserCount = async () => {
  //     try {
  //       const response = await fetch('/api/auth/count');
  //       const data = await response.json();
        
  //       if (data.count !== undefined) {
  //         setStats(prevStats => {
  //           const newStats = [...prevStats];
  //           // Update Citizens Registered with API data
  //           newStats[0] = {...newStats[0], value: data.count};
  //           return newStats;
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user count:', error);
  //     }
  //   };

  //   fetchUserCount();
  // }, []);

  // Animate stats counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % stats.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [stats.length]);

  useEffect(() => {
    const animateStat = () => {
      setAnimatedStats(prevStats => {
        return prevStats.map((stat, index) => {
          if (index === currentStatIndex) {
            return {
              ...stat,
              animatedValue: stat.value
            };
          }
          return stat;
        });
      });
    };
    
    animateStat();
  }, [currentStatIndex, stats]);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
// useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       // Total users
//       const userRes = await fetch('/api/auth/count');
//       const userData = await userRes.json();

//       // Total complaints
//       const complaintRes = await fetch('/api/complaints/count');
//       const complaintData = await complaintRes.json();

//       // Resolved complaints
//       const resolvedRes = await fetch('/api/complaints/count?status=resolved');
//       const resolvedData = await resolvedRes.json();

//       setStats(prevStats => [
//         { ...prevStats[0], value: userData.count },
//         { ...prevStats[1], value: resolvedData.count },
//         { ...prevStats[2], value: 32 }, // Wards Active
//         { ...prevStats[3], value: 92 } // Satisfaction Rate
//       ]);

//     } catch (err) {
//       console.error('Error fetching stats:', err);
//     }
//   };

//   fetchStats();
// }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
     
<div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24 gap-12">
  <motion.div 
    className="md:w-1/2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="inline-block bg-blue-100 text-nepal-blue px-4 py-1 rounded-full mb-4">
      <span>Transforming Governance in Nepal</span>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
      Smart <span className="text-nepal-blue">Palika</span> Complaint Portal
    </h1>
    <p className="text-xl text-gray-600 mb-8 max-w-2xl">
      A citizen-centric platform to report and track civic issues across Nepal. 
      Join thousands of citizens making Nepal a better place to live.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link 
        to="/submit-complaint" 
        className="bg-nepal-red hover:bg-red-700 text-white font-medium py-4 px-8 rounded-lg text-center transition duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
      >
        File a Complaint
        <FiArrowRight className="ml-2" />
      </Link>
      {!user && (
        <Link 
          to="/register" 
          className="bg-white border-2 border-nepal-blue text-nepal-blue hover:bg-blue-50 font-medium py-4 px-8 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
        >
          Create Account
        </Link>
      )}
    </div>
  </motion.div>
  
  <motion.div 
    className="md:w-1/2 relative"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className="relative bg-gradient-to-br from-nepal-blue to-nepal-red rounded-3xl overflow-hidden shadow-2xl">
      
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="bg-white p-2 rounded-full mr-3">
              <FiMapPin className="text-nepal-red w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-semibold">Nepal Civic Platform</h3>
          </div>
          
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
            {/* Nepal Image with Overlay */}
              <img 
                    src={nepalMap}
                    alt="Beautiful Nepal Landscape"
                    className="w-full h-full object-cover"
                  />
            
          
            
            <div className="absolute inset-0 bg-gradient-to-t from-nepal-blue/70 to-transparent"></div>
            
            {/* Location Indicators */}
            <div className="absolute top-1/2 left-1/3">
              <div className="relative">
                <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="relative w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2">
              <div className="relative">
                <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="relative w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-1/3 left-1/3">
              <div className="relative">
                <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="relative w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-2/3">
              <div className="relative">
                <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="relative w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Stats Box */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <FiClock className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">Resolution Time</p>
                  <p className="text-2xl font-bold text-green-600">5.2 Days</p>
                </div>
              </div>
            </div>
          </div>
{/*           
          <div className="mt-6 flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats[0].value}+</p>
              <p className="text-blue-100 text-sm">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats[1].value}</p>
              <p className="text-blue-100 text-sm">Resolved Complaints</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats[2].value}</p>
              <p className="text-blue-100 text-sm">Wards Active</p>
            </div>
          </div> */}
        </div>
      
    </div>
  </motion.div>
</div>

      {/* Nepal Map Pattern Divider */}
      <div className="py-8 flex justify-center">
        <div className="h-2 w-48 bg-gradient-to-r from-nepal-blue via-nepal-red to-nepal-blue rounded-full"></div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold text-nepal-blue mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our platform connects citizens with local government officials to resolve civic issues efficiently
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="text-nepal-red mb-6 bg-blue-50 p-4 rounded-full inline-flex">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section with Animation */}
      <div className="py-16 bg-gradient-to-br from-nepal-blue to-nepal-red rounded-3xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {animatedStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-white p-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.p 
                className="text-4xl md:text-5xl font-bold mb-2"
                animate={{ 
                  scale: currentStatIndex === index ? [1, 1.1, 1] : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                {stat.animatedValue}{stat.suffix}
              </motion.p>
              <p className="text-blue-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold text-nepal-blue mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Citizens Say
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hear from citizens who have used our platform to resolve community issues
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 ${index === currentTestimonial ? 'border-nepal-red block' : 'hidden'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentTestimonial ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mr-6">
                  <FiUser className="text-nepal-blue w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-700 italic text-lg mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${index === currentTestimonial ? 'bg-nepal-red' : 'bg-gray-300'}`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="bg-gradient-to-r from-nepal-blue to-nepal-red rounded-3xl overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-blue-100 mb-8">
                Join thousands of citizens improving their communities through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/submit-complaint" 
                  className="bg-white text-nepal-red hover:bg-gray-100 font-medium py-4 px-8 rounded-lg text-center transition duration-300"
                >
                  Report an Issue
                </Link>
                {!user && (
                  <Link 
                    to="/register" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-4 px-8 rounded-lg text-center transition duration-300"
                  >
                    Create Account
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 bg-white/10 flex items-center justify-center p-12">
              <div className="flex flex-col items-center text-white text-center">
                <div className="bg-white/20 rounded-full p-6 mb-6">
                  <FiMapPin className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nationwide Coverage</h3>
                <p>Aiming to be active in all 7 provinces and 753 local governments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;