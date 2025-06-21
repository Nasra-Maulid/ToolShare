import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ToolList from './pages/ToolList';
import ToolDetail from './pages/ToolDetail';
import Dashboard from './pages/Dashboard';
import NavBar from './components/NavBar';

function App() {
    return (
        <div className="App">
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<ToolList />} />
                <Route path="/tools/:id" element={<ToolDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;