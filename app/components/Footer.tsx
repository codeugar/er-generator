import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">
          Contact me at:
          <a 
            href="mailto:codeugar@gmail.com" 
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            codeugar@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
