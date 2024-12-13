import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white shadow mt-auto">
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} GitHub Repo Copier. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <a
              href="https://www.julienhovan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm"
            >
              Visit my website
            </a>
            <a
              href="https://github.com/JewelsHovan/RepoToClipboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm"
            >
              (Open source repo here)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 