import React from 'react';
import Header from './Components/header';
import Home from './Pages/Home';
import Footer from './Components/Footer';

const App: React.FC = () => {
  const handleMenuClick = () => {
    console.log('Menu clicked!');
  };

  return (
    <div className="app">
      <Header onMenuClick={handleMenuClick} />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;
