import { useState, useEffect } from 'react';
import api from '../../api';
import './ToolList.css';

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;

      const response = await api.get('/tools', { params });
      setTools(response.data);
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [filters]);

  return (
    <div className="tool-list-container">
  <div className="tool-filters">
    <input
      type="text"
      className="search-input"
      placeholder="Search tools..."
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    />

    <select
      className="filter-select"
      value={filters.category}
      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
    >
      <option value="">All Categories</option>
      <option value="garden">Garden Tools</option>
      <option value="hand">Hand Tools</option>
      <option value="power">Power Tools</option>
    </select>

    <div className="price-range">
      <input
        type="number"
        className="search-input"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
      />
      <input
        type="number"
        className="search-input"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
      />
    </div>
  </div>

  {loading ? (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading tools...</p>
    </div>
  ) : tools.length > 0 ? (
    <div className="tool-grid">
      {tools.map((tool) => (
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
          <p>{tool.category}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No tools found matching your criteria.</p>
  )}
</div>

  );
};
export default ToolList;
