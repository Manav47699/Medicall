"use client";
import { useState } from 'react';

export default function MedicAllHome() {
  const [urgentOpen, setUrgentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }

        .service-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
        }

        html {
          scroll-behavior: smooth;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .rolldown-content {
          max-height: ${urgentOpen ? '500px' : '0'};
          overflow: hidden;
          transition: max-height 0.5s ease-in-out;
        }
      `}</style>


      {/* Enhanced Navigation */}
      <nav className="glass fixed top-4 left-4 right-4 z-50 rounded-2xl shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <i className="fas fa-heartbeat text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold gradient-text">MEDIC-ALL</span>
            </div>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-8">
              <li><a href="#home" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300">Home</a></li>
              <li><a href="#services" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300">Services</a></li>
              <li><a href="#about" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300">About</a></li>
              <li><a href="#community" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300">Community</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300">Contact</a></li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacing for fixed nav */}
      <div className="pt-24"></div> 
      

      {/* Enhanced Urgent Services */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <button
          onClick={() => setUrgentOpen(!urgentOpen)}
          className="block w-full btn-primary text-white font-bold py-4 px-6 rounded-xl cursor-pointer text-center animate-glow"
        >
          <i className="fas fa-exclamation-triangle mr-2"></i>
          URGENT SERVICES
        </button>
        
        <div className="rolldown-content glass rounded-b-xl shadow-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Emergency Services</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="service-card p-4 rounded-xl cursor-pointer hover:bg-red-50 transition-all duration-300">
                <i className="fas fa-bed text-red-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800">Hospital Beds</h3>
                <p className="text-sm text-gray-600">Check availability</p>
              </div>
              <div className="service-card p-4 rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-300">
                <i className="fas fa-brain text-blue-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800">Mental Health</h3>
                <p className="text-sm text-gray-600">Support hotline</p>
              </div>
              <div className="service-card p-4 rounded-xl cursor-pointer hover:bg-green-50 transition-all duration-300">
                <i className="fas fa-map-marker-alt text-green-500 text-2xl mb-2"></i>
                <h3 className="font-semibold text-gray-800">Nearest Hospital</h3>
                <p className="text-sm text-gray-600">Find locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section id="home" className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
          {/* Content */}
          <div className="lg:w-1/2 text-center lg:text-left animate-fadeInUp">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="gradient-text block">MEDIC-ALL</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-red-100">
              <span className="font-bold">All-in-one</span> destination for your medical needs
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2">
                <i className="fas fa-shopping-cart"></i>
                <span>Shop Now</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center animate-float">
            <div className="w-80 h-80 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <i className="fas fa-user-md text-8xl text-white/80"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare solutions at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service Card 1 */}
            <div className="service-card p-8 rounded-2xl text-center group animate-fadeInUp">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-gentle">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">MEDIC-ALL Community</h3>
              <p className="text-gray-600">Connect with others sharing similar health journeys and experiences</p>
            </div>

            {/* Service Card 2 */}
            <div className="service-card p-8 rounded-2xl text-center group animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-gentle">
                <i className="fas fa-shopping-bag text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">MEDIC-ALL shop</h3>
              <p className="text-gray-600">Shop for medical products with the best deals</p>
            </div>

            {/* Service Card 3 */}
            <div className="service-card p-8 rounded-2xl text-center group animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-gentle">
                <i className="fas fa-mobile-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Offline Apps</h3>
              <p className="text-gray-600">Download our free offline applications for on-the-go service</p>
            </div>

            {/* Service Card 4 */}
            <div className="service-card p-8 rounded-2xl text-center group animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-gentle">
                <i className="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Assistance</h3>
              <p className="text-gray-600">Feel free to ask MEDIC-ALL bot about your queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Applications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Our Applications</h2>
            <p className="text-xl text-gray-600">Discover our innovative services</p>
          </div>

          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            <div className="min-w-[300px] bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-4 flex items-center justify-center">
                <i className="fas fa-laptop-medical text-red-500 text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Healthcare Portal</h3>
              <p className="text-gray-600">Comprehensive health management system</p>
            </div>

            <div className="min-w-[300px] bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 flex items-center justify-center">
                <i className="fas fa-heartbeat text-blue-500 text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Health Monitor</h3>
              <p className="text-gray-600">Real-time health tracking and monitoring</p>
            </div>

            <div className="min-w-[300px] bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center">
                <i className="fas fa-pills text-green-500 text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Medication Tracker</h3>
              <p className="text-gray-600">Never miss your medication schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Community Section */}
      <section id="community" className="py-20 bg-gradient-to-br from-red-500 to-pink-600 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join Our <span className="gradient-text">Community</span>
            </h2>
            <p className="text-xl text-red-100 mb-12 max-w-3xl mx-auto">
              Connect with healthcare professionals and individuals sharing similar health journeys. Share experiences, get advice, and support each other.
            </p>
            <p className="text-lg text-red-100 mb-8 italic text-center">Interact with</p>
            
            {/* Community Member Pictures */}
            <div className="flex justify-center items-center gap-8 mb-12">
              <div className="w-40 h-40 border rounded overflow-hidden">
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                  Member 1
                </div>
              </div>
              <div className="w-40 h-40 border rounded overflow-hidden">
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                  Add Photo
                </div>
              </div>
              <div className="w-40 h-40 border rounded overflow-hidden">
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                  Add Photo
                </div>
              </div>
            </div>

            <p className="text-lg text-red-100 mb-8 italic text-center">And many more</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary px-10 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 animate-pulse-gentle">
                <i className="fas fa-user-plus"></i>
                <span>Join Community</span>
              </button>
              
              <button className="btn-secondary px-10 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 animate-pulse-gentle">
                <i className="fas fa-sign-in-alt"></i>
                <span>Log in</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-heartbeat text-white text-lg"></i>
                </div>
                <span className="text-2xl font-bold gradient-text">MEDIC-ALL</span>
              </div>
              <p className="text-gray-400 max-w-md">Your comprehensive healthcare companion, providing medical services, community support, and AI-powered assistance for all your health needs.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Manav Acharya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Font Awesome CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet"
      />
    </div>
  );
}