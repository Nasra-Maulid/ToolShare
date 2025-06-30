 import { useEffect, useState } from 'react';
import api from '../../api';
import HeroSection from '../../components/HeroSection/HeroSection';
import './Home.css';

const Home = () => {
  const [featuredTools, setFeaturedTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        // First try specific featured endpoint
        let response;
        try {
          response = await api.get('/tools/featured');
        } catch {
          // Fallback to filtering all tools
          response = await api.get('/tools');
          response.data = response.data.filter(tool => tool.featured);
        }
        setFeaturedTools(response.data.slice(0, 4)); // Show first 4 featured
      } catch (error) {
        console.error("Error loading tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  return (
    <div className="home-container">
      <HeroSection />
            <div className="features">
        <div className="feature">
          <div className="feature-icon">💰</div>
          <h3>Save Money</h3>
          <p>Rent for a fraction of retail prices</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🌱</div>
          <h3>Reduce Waste</h3>
          <p>Tools get used instead of collecting dust</p>
        </div>
        <div className="feature">
          <div className="feature-icon">👋</div>
          <h3>Build Community</h3>
          <p>Meet neighbors through shared projects</p>
        </div>
      </div>
      <div className="how-it-works">
  <h2 className="section-title">How It Works</h2>
  <div className="steps-container">
    <div className="step fade-in-up">
      <div className="step-number">1</div>
      <h3>Browse</h3>
      <p>Search or filter tools available near you by category and price.</p>
    </div>
    <div className="step fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="step-number">2</div>
      <h3>Book</h3>
      <p>Select your tool, choose the dates, and confirm your rental instantly.</p>
    </div>
    <div className="step fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="step-number">3</div>
      <h3>Pick Up</h3>
      <p>Coordinate with the lender and get your tool when you need it.</p>
    </div>
    <div className="step fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="step-number">4</div>
      <h3>Return</h3>
      <p>Bring the tool back as agreed. It's easy, reliable, and community-driven.</p>
    </div>
  </div>
</div>

      <div className="featured-tools">
        <h2>Featured Tools</h2>
        {loading ? (
          <p>Loading tools...</p>
        ) : featuredTools.length > 0 ? (
          <div className="tools-grid">
            {featuredTools.map(tool => (
              <div key={tool.id} className="tool-card">
                <img 
                  src={tool.image_url || '/images/tool-placeholder.jpg'} 
                  alt={tool.name}
                  onError={(e) => {
                    e.target.src = '/images/tool-placeholder.jpg';
                  }}
                />
                <h3>{tool.name}</h3>
                <p>${tool.daily_rate}/day</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No featured tools available</p>
        )}
      </div>
    </div>
  );
};
export default Home;