import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register } from './utils/sw-registration'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA functionality
register({
  onSuccess: () => {
    console.log('Arlo PWA installed successfully');
  },
  onUpdate: () => {
    console.log('Arlo PWA updated');
  },
});
