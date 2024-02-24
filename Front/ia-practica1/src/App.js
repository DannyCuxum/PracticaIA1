import {Route,BrowserRouter,Routes} from 'react-router-dom';
import './App.css';
import Principal from './components/Principal';

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Principal />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
