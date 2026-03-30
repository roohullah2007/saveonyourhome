import React from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
