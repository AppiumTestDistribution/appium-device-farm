import RootRouter from './router/RootRouter';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/sidebar';
import './app.css';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <Sidebar />
        <div className="app-body-container">
          <RootRouter />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
