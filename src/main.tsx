import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { register } from './utils/sw-registration'

createRoot(document.getElementById("root")!).render(<App />);

// Temporarily disable service worker registration to fix the process.env error
// TODO: Re-enable after the issue is resolved
console.log('Arlo AI Assistant loaded successfully');

// Register service worker for PWA functionality (disabled for now)
// register({
//   onSuccess: () => {
//     console.log('Arlo PWA installed successfully');
//   },
//   onUpdate: () => {
//     console.log('Arlo PWA updated');
//   },
// });
