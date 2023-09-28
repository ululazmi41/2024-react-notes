import React from 'react';
import { createRoot } from 'react-dom/client';

// import style
import './styles/style.css';
import './styles/dots.css';
import App from './App';

const element = document.getElementById('root');
const root = createRoot(element);

root.render(<App />);