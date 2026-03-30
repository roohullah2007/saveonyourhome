import React from 'react';
import Header from '@/Components/Header';

const PropertiesLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PropertiesLayout;
