import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import './styles/signatureField.css';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

serviceWorker.unregister();
