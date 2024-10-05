import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">My Tailwind Page</h1>
          <div className="text-white space-x-4">
            <a href="#home" className="hover:text-gray-300">Home</a>
            <a href="#about" className="hover:text-gray-300">About</a>
            <a href="#contact" className="hover:text-gray-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="flex-grow bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to My Page</h2>
          <p className="text-gray-700 mb-8">This is a simple page created with React and Tailwind CSS.</p>
          <a href="#about" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200">
            Learn More
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are passionate about web development and love using tools like React and Tailwind CSS to create beautiful, responsive websites.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 My Tailwind Page. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
