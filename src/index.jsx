import React from 'react';
import { createRoot } from 'react-dom/client';

// Styles
import './styles/style.css';
import './styles/loading.css';
import './styles/tailwind.css';
import './styles/noteInput.css';

// Components
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const element = document.getElementById('root');
const root = createRoot(element);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);