import RootRouter from './router/RootRouter';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/sidebar';
import { ToastContainer } from 'react-toastify';
import './app.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <Sidebar />
        <div className="app-body-container">
          <ToastContainer />
          <RootRouter />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
