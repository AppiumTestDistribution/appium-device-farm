import './App.css';
import DevicesContainer from './DevicesContainer';

const App = () => (
  <div className="App">
    <div className="header">
      <h1 className="mb-4 mt-4 ml-2">Appium Device Farm</h1>
    </div>
    <DevicesContainer />
  </div>
);
export default App;
