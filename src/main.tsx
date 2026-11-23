import {createRoot} from 'react-dom/client';import {registerSW} from 'virtual:pwa-register';import './index.css';
import App from './App';import {Provider} from './store';
import {initFx} from './fx';
registerSW({immediate:true});initFx();
createRoot(document.getElementById('root')!).render(<Provider><App/></Provider>);
