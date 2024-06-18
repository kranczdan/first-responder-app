import React from 'react';
import RoleSelector from '../components/RoleSelector';
import '../styles/Home.css';

const Home = () => (
  <div className="home-container">
    <h1>Willkommen zur First Responder App</h1>
    <RoleSelector />
  </div>
);

export default Home;
