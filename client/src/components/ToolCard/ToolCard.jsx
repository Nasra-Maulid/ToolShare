import './ToolCard.css';

const ToolCard = ({ tool }) => {
  return (
    <article className="tool-card">
      <div className="tool-image">
        <img 
          src={`/images/tools/${tool.image || 'tool-default.jpg'}`} 
          alt={tool.name} 
        />
        <div className="tool-badge">${tool.daily_rate}/day</div>
      </div>
      <div className="tool-content">
        <h3>{tool.name}</h3>
        <p className="tool-description">{tool.description.substring(0, 100)}...</p>
        <div className="tool-rating">
          <span className="stars">★★★★☆</span>
          <span>(24)</span>
        </div>
      </div>
      <a href={`/tools/${tool.id}`} className="btn btn-primary tool-button">
        Rent Now
      </a>
    </article>
  );
};

export default ToolCard;