import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <h1 style={{ color: 'red' }}>Is this showing?</h1>
    </div>
  );
}

export default App;