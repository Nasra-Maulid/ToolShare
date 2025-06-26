import { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import ToolCard from '../../components/ToolCard/ToolCard';
import api from '../../api';
import './Home.css';

const Home = () => {
  const [featuredTools, setFeaturedTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await api.get('/tools?featured=true');
        setFeaturedTools(response.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching tools:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  return (
    <div className="home-container">
      <HeroSection />
      
      <section className="featured-tools">
        <div className="container">
          <h2>Featured Tools</h2>
          <p className="section-subtitle">Most popular tools in your area</p>
          
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="tools-grid">
              {featuredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="container">
          <h2>How ToolShare Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Find Tools</h3>
              <p>Browse tools available in your neighborhood</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Online</h3>
              <p>Select your dates and book instantly</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pick Up & Use</h3>
              <p>Meet the owner and get the tool</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Return & Review</h3>
              <p>Return on time and leave a review</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <a href="/tools" className="btn btn-primary btn-lg">Browse All Tools</a>
        </div>
      </section>
    </div>
  );
};

export default Home;