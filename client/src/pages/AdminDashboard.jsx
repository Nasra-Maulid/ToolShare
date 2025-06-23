import { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [tools, setTools] = useState([]);
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user?.is_admin) return;
        
        const fetchData = async () => {
            const toolsData = await api.get(`/admin/tools?user_id=${user.id}`)
                .then(res => res.data);
            setTools(toolsData);
            
            const usersData = await api.get('/users')
                .then(res => res.data);
            setUsers(usersData);
        };
        fetchData();
    }, [user]);

    if (!user?.is_admin) return <div>Access denied</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            
            <h2>All Tools</h2>
            <ul>
                {tools.map(tool => (
                    <li key={tool.id}>
                        {tool.name} - ${tool.daily_rate}
                        <button onClick={async () => {
                            await api.delete(`/admin/tools/${tool.id}?user_id=${user.id}`);
                            setTools(tools.filter(t => t.id !== tool.id));
                        }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            
            <h2>All Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;