import { Link } from 'react-router-dom';

function NavBar() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/tools">Browse</Link>
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    {user?.is_admin && (
                        <Link to="/admin">Admin</Link>
                    )}
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
}

export default NavBar;
