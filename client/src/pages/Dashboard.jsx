import { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [tools, setTools] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) return;
            
            setUser(userData);
            
            // Fetch user's tools
            const userTools = await api.get(`/tools?owner_id=${userData.id}`).then(res => res.data);
            setTools(userTools);
            
            // Fetch user's bookings
            const userBookings = await api.get(`/bookings?user_id=${userData.id}`).then(res => res.data);
            setBookings(userBookings);
        };
        fetchData();
    }, []);

    if (!user) return <div>Please log in to view dashboard</div>;

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            
            <h2>Your Tools</h2>
            {tools.length > 0 ? (
                <ul>
                    {tools.map(tool => (
                        <li key={tool.id}>{tool.name}</li>
                    ))}
                </ul>
            ) : (
                <p>You haven't listed any tools yet.</p>
            )}
            
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking.id}>
                            Tool ID: {booking.tool_id} | 
                            Dates: {new Date(booking.start_date).toLocaleDateString()} - 
                            {new Date(booking.end_date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no bookings yet.</p>
            )}
        </div>
    );
};

export default Dashboard;