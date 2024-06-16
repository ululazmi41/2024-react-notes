import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Styles
import './styles/style.css';
import './styles/loading.css';
import './styles/tailwind.css';
import './styles/authstyle.css';
import './styles/detailpage.css';
import './styles/themetoggler.css';

// Components
import App from './App';

const element = document.getElementById('root');
const root = createRoot(element);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);