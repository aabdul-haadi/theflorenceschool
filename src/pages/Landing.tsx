import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">The Florence School</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#home" className="hover:text-gray-300">Home</a>
          <a href="#about" className="hover:text-gray-300">About</a>
          <a href="#classes" className="hover:text-gray-300">Classes</a>
          <a href="#contact" className="hover:text-gray-300">Contact</a>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-blue-900 font-semibold px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-blue-100 text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Welcome to The Florence School</h2>
        <p className="text-lg text-gray-700 mb-6">
          A prestigious educational institution nurturing minds and inspiring futures.
        </p>
        <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800">
          Explore Our Classes
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-4">About Us</h3>
        <p className="max-w-3xl mx-auto text-gray-700">
          Founded in 1995, The Florence School is dedicated to academic excellence and holistic development. 
          We foster creativity, discipline, and innovation in a safe and supportive environment.
        </p>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-16 px-6 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold mb-6">Our Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {['Nursery', 'KG 1', 'Primary'].map((cls) => (
            <div key={cls} className="bg-white p-6 rounded shadow hover:shadow-lg">
              <h4 className="text-xl font-bold mb-2">{cls}</h4>
              <p className="text-gray-600">High-quality early education tailored for young learners.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-4">Contact Us</h3>
        <p className="text-gray-700 mb-6">Email: info@florenceschool.edu | Office Hours: Mon–Fri 8AM–4PM</p>
        <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800">
          Send a Message
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} The Florence School. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
