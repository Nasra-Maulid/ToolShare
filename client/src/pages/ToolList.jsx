import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SearchTools from '../components/SearchTools'; // Assuming SearchTools is defined in this path

const ToolList = () => {
    const [tools, setTools] = useState([]);

    // Add at top of component
    const [searchParams, setSearchParams] = useState({
        search: '',
        max_price: ''
    });

    // Replace tool fetch with:
    useEffect(() => {
        const fetchTools = async () => {
            const params = new URLSearchParams(searchParams);
            const toolsData = await api.get(`/tools?${params.toString()}`)
                .then(res => res.data);
            setTools(toolsData);
        };
        fetchTools();
    }, [searchParams]);

    return (
        <div>
            <h1>Available Tools</h1>

            {/* Add above tool grid */}
            <SearchTools setSearchParams={setSearchParams} />

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
