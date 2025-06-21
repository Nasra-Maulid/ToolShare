import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const Signup = () => {
    const handleSubmit = async (values) => {
        try {
            const response = await api.post('/signup', values);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/';
        } catch (error) {
            alert("Signup failed!");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                validationSchema={Yup.object({
                    username: Yup.string().required('Required'),
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().min(6, 'Too short!').required('Required'),
                })}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Field name="username" placeholder="Username" />
                    <ErrorMessage name="username" />
                    <Field name="email" placeholder="Email" />
                    <ErrorMessage name="email" />
                    <Field name="password" type="password" placeholder="Password" />
                    <ErrorMessage name="password" />
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Signup;