import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nepal-blue to-nepal-red">
      {children}
    </div>
  );
};

export default AuthLayout;