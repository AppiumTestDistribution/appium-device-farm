import RootRouter from './router/RootRouter';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/sidebar';
import './app.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="app-body-container">
          <RootRouter />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
