<img
  src={tool.image_url || '/images/tool-placeholder.jpg'}
  alt={tool.name}
  onError={(e) => {
    e.target.src = '/images/tool-placeholder.jpg';
  }}
/>