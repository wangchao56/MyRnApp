import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '@myapp/shared';
import { setupDefaultShare } from '@myapp/share';
import App from './App';
import './styles/vector-icons.css';

setupDefaultShare({
  onNotify: (message) => window.alert(message),
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <StoreProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StoreProvider>
    </React.StrictMode>
  );
}
