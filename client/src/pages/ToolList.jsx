import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ToolList = () => {
    const [tools, setTools] = useState([]);

    useEffect(() => {
        const fetchTools = async () => {
            const toolsData = await api.get('/tools').then(res => res.data);
            setTools(toolsData);
        };
        fetchTools();
    }, []);

    return (
        <div>
            <h1>Available Tools</h1>
            <div className="tool-grid">
                {tools.map(tool => (
                    <div key={tool.id} className="tool-card">
                        <Link to={`/tools/${tool.id}`}>
                            <img src={tool.image_url || "https://via.placeholder.com/150"} alt={tool.name} />
                            <h3>{tool.name}</h3>
                            <p>${tool.daily_rate}/day</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToolList;