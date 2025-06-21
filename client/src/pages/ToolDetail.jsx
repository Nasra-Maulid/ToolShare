import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const ToolDetail = () => {
    const { id } = useParams();
    const [tool, setTool] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchTool = async () => {
            const toolData = await api.get(`/tools/${id}`).then(res => res.data);
            setTool(toolData);
        };
        fetchTool();
    }, [id]);

    const handleBooking = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error("Not logged in");
            
            await api.post('/bookings', {
                tool_id: id,
                user_id: user.id,
                start_date: values.start_date,
                end_date: values.end_date
            });
            alert("Booking successful!");
        } catch (error) {
            alert("Booking failed!");
        }
    };

    if (!tool) return <div>Loading...</div>;

    return (
        <div className="tool-detail">
            <img src={tool.image_url || "https://via.placeholder.com/300"} alt={tool.name} />
            <h1>{tool.name}</h1>
            <p>${tool.daily_rate}/day</p>
            <p>{tool.description}</p>

            <h2>Book This Tool</h2>
            <Formik
                initialValues={{ start_date: '', end_date: '' }}
                validationSchema={Yup.object({
                    start_date: Yup.date().required('Required'),
                    end_date: Yup.date().min(
                        Yup.ref('start_date'),
                        "End date must be after start date"
                    ).required('Required'),
                })}
                onSubmit={handleBooking}
            >
                <Form>
                    <Field name="start_date" type="date" />
                    <ErrorMessage name="start_date" />
                    <Field name="end_date" type="date" />
                    <ErrorMessage name="end_date" />
                    <button type="submit">Book Now</button>
                </Form>
            </Formik>
        </div>
    );
};

export default ToolDetail;