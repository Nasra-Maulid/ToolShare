import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/tools">Browse Tools</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default NavBar;