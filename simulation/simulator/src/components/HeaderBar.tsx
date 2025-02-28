import React from 'react';

const HeaderBar: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px' }}>
      <img 
        src="/assets/symbol.svg" 
        alt="Logo" 
        style={{ height: '40px', marginRight: '10px' }}
      />
      <h1 style={{ display: 'inline-block' }}>Cardano Network Simulator</h1>
    </header>
  );
};

export default HeaderBar;
