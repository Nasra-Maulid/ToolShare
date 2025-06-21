import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const Login = () => {
    const handleSubmit = async (values) => {
        try {
            const response = await api.post('/login', values);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/';
        } catch (error) {
            alert("Login failed!");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={Yup.object({
                    username: Yup.string().required('Required'),
                    password: Yup.string().required('Required'),
                })}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Field name="username" placeholder="Username" />
                    <ErrorMessage name="username" />
                    <Field name="password" type="password" placeholder="Password" />
                    <ErrorMessage name="password" />
                    <button type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;