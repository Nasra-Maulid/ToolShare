import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [toolRes, reviewsRes] = await Promise.all([
          api.get(`/tools/${id}`),
          api.get(`/reviews?tool_id=${id}`)
        ]);

        if (!toolRes.data) {
          throw new Error('Tool not found');
        }

        setTool({
          ...toolRes.data,
          image_url: toolRes.data.image_url || '/images/tool-placeholder.jpg'
        });

        setReviews(reviewsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load tool details');
        console.error('Error loading tool:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = async () => {
    try {
      setError('');
      setSuccess('');
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login', { state: { from: `/tools/${id}` } });
        return;
      }

      if (!bookingDates.start || !bookingDates.end) {
        throw new Error('Please select both start and end dates');
      }

      const response = await api.post('/bookings', {
        tool_id: id,
        user_id: user.id,
        start_date: bookingDates.start,
        end_date: bookingDates.end
      });

      setSuccess('Booking successful!');
      setBookingDates({ start: '', end: '' });
      
      // Refresh tool availability
      const toolRes = await api.get(`/tools/${id}`);
      setTool(toolRes.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Booking failed');
      console.error('Booking error:', err);
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading tool details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  if (!tool) return <div className="not-found">Tool not found</div>;

  return (
    <div className="tool-detail-container">
      <div className="tool-images">
        <div className="main-image">
          <img 
            src={tool.image_url} 
            alt={tool.name}
            onError={(e) => {
              e.target.src = '/images/tool-placeholder.jpg';
              e.target.className = 'image-fallback';
            }}
          />
        </div>
      </div>
      
      <div className="tool-info">
        <h1>{tool.name}</h1>
        <div className="price">${tool.daily_rate.toFixed(2)} <span>/ day</span></div>
        
        <div className="tool-meta">
          <div className="meta-item">
            <span className="meta-label">Owner:</span>
            <span className="meta-value">{tool.owner_username || 'Unknown'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <span className={`status ${tool.available ? 'available' : 'unavailable'}`}>
              {tool.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Rating:</span>
            <span className="rating">
              {reviews.length > 0 
                ? `${(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}/5 (${reviews.length})`
                : 'No reviews yet'}
            </span>
          </div>
        </div>
        
        <p className="tool-description">
          {tool.description || 'No description provided.'}
        </p>
        
        <div className="booking-section">
          <h3>Book This Tool</h3>
          {success && <div className="success-message">{success}</div>}
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
                disabled={!bookingDates.start}
              />
            </div>
          </div>
          <button 
            onClick={handleBooking}
            className="btn btn-primary"
            disabled={!bookingDates.start || !bookingDates.end || !tool.available}
          >
            {tool.available ? 'Confirm Booking' : 'Not Available'}
          </button>
        </div>
      </div>
      
      <div className="tool-reviews">
        <h2>Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">{review.user?.username || 'Anonymous'}</div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  <span className="review-date">
                    {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : ''}
                  </span>
                </div>
              </div>
              <p className="review-text">{review.comment || 'No comment provided.'}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;