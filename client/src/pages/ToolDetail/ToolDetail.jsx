import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import './ToolDetail.css';

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingDates, setBookingDates] = useState({
    start: '',
    end: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          api.get(`/tools/${id}`),
          api.get(`/reviews?tool_id=${id}`)
        ]);
        setTool(toolRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Failed to load tool details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }
      
      await api.post('/bookings', {
        tool_id: id,
        user_id: user.id,
        start_date: bookingDates.start,
        end_date: bookingDates.end
      });
      
      alert('Booking successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!tool) return <div>Tool not found</div>;

  return (
    <div className="tool-detail-container">
      <div className="tool-images">
        <div className="main-image">
          <img src={`/images/tools/${tool.image || 'tool-default.jpg'}`} alt={tool.name} />
        </div>
      </div>
      
      <div className="tool-info">
        <h1>{tool.name}</h1>
        <div className="price">${tool.daily_rate} <span>/ day</span></div>
        
        <div className="tool-meta">
          <div className="meta-item">
            <span className="meta-label">Owner:</span>
            <span className="meta-value">{tool.owner?.username}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{tool.category || 'General'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Availability:</span>
            <span className="meta-value">{tool.available ? 'Available' : 'Unavailable'}</span>
          </div>
        </div>
        
        <p className="tool-description">{tool.description}</p>
        
        <div className="booking-section">
          <h3>Book This Tool</h3>
          <div className="date-picker">
            <div className="date-group">
              <label>Start Date</label>
              <input
                type="date"
                value={bookingDates.start}
                onChange={(e) => setBookingDates({...bookingDates, start: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="date-group">
              <label>End Date</label>
              <input
                type="date"
                value={bookingDates.end}
                onChange={(e) => setBookingDates({...bookingDates, end: e.target.value})}
                min={bookingDates.start || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <button 
            onClick={handleBooking}
            className="btn btn-primary"
            disabled={!bookingDates.start || !bookingDates.end}
          >
            Confirm Booking
          </button>
        </div>
      </div>
      
      <div className="tool-reviews">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">{review.user?.username}</div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="review-text">{review.comment}</p>
              <div className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;