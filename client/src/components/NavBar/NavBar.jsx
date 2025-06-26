import './NavBar.css';

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="/" className="navbar-brand">
          <img src="/images/logo.png" alt="ToolShare" className="navbar-logo" />
          <span>ToolShare</span>
        </a>
        
        <div className="navbar-links">
          <a href="/tools" className="navbar-link">Browse</a>
          
          {user ? (
            <a href="/dashboard" className="user-avatar">
              <img 
                src={user.avatar || '/images/default-avatar.jpg'} 
                alt={user.username} 
              />
            </a>
          ) : (
            <a href="/login" className="btn btn-primary">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;