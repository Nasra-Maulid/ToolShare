import { useEffect, useState } from 'react';
import { getTools } from '../api';

function Home() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      const toolsData = await getTools();
      setTools(toolsData);
    };
    fetchTools();
  }, []);

  return (
    <div>
      <h1>Welcome to ToolShare</h1>
      <p>Borrow tools from your neighbors</p>
      <h2>Available Tools</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.id}>{tool.name} - ${tool.daily_rate}/day</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;