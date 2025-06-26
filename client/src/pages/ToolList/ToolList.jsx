import { useState, useEffect } from 'react';
import ToolCard from '../../components/ToolCard/ToolCard';
import HeroSection from '../../components/HeroSection/HeroSection';
import './ToolList.css';
import api from '../../api';

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'newest'
  });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await api.get('/tools');
        setTools(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tools:", error);
        setLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tools...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      
      <main className="tool-list-container">
        <div className="tool-filters">
          <input
            type="text"
            placeholder="Search tools..."
            className="search-input"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="power">Power Tools</option>
            <option value="garden">Garden Tools</option>
            <option value="hand">Hand Tools</option>
          </select>
          
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        
        <div className="tool-grid">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <span>Page 1 of 5</span>
          <button className="pagination-btn">Next</button>
        </div>
      </main>
    </>
  );
};

export default ToolList;