import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tools, setTools] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('tools');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/login');
        return;
      }
      
      setUser(userData);
      
      try {
        const [toolsRes, bookingsRes] = await Promise.all([
          api.get(`/tools?owner_id=${userData.id}`),
          api.get(`/bookings?user_id=${userData.id}`)
        ]);
        setTools(toolsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
        
        <nav className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            My Tools
          </button>
          <button 
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          {user.is_admin && (
            <button 
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Panel
            </button>
          )}
        </nav>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'tools' && (
          <div className="tools-section">
            <div className="section-header">
              <h2>My Tools</h2>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/tools/new')}
              >
                Add New Tool
              </button>
            </div>
            
            {tools.length > 0 ? (
              <div className="tools-grid">
                {tools.map(tool => (
                  <div key={tool.id} className="dashboard-tool-card">
                    <img 
                      src={`/images/tools/${tool.image || 'tool-default.jpg'}`} 
                      alt={tool.name} 
                    />
                    <div className="tool-info">
                      <h4>{tool.name}</h4>
                      <p>${tool.daily_rate}/day</p>
                      <div className="tool-status">
                        {tool.available ? (
                          <span className="available">Available</span>
                        ) : (
                          <span className="unavailable">Rented Out</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't listed any tools yet.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/tools/new')}
                >
                  List Your First Tool
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-tool">
                      <img 
                        src={`/images/tools/${booking.tool?.image || 'tool-default.jpg'}`} 
                        alt={booking.tool?.name} 
                      />
                      <h4>{booking.tool?.name}</h4>
                    </div>
                    <div className="booking-dates">
                      <div>
                        <span className="label">From:</span>
                        <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="label">To:</span>
                        <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="booking-status">
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't made any bookings yet.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/tools')}
                >
                  Browse Tools
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'admin' && user.is_admin && (
          <div className="admin-section">
            <h2>Admin Panel</h2>
            <p>Admin features coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;