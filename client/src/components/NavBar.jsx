import { Link } from 'react-router-dom';

function NavBar() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/tools">Browse Tools</Link>
            {user ? (
                <Link to="/dashboard">Dashboard</Link>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
}

export default NavBar;