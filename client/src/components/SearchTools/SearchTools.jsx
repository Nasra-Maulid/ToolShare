import { Formik, Form, Field } from 'formik';
import api from '../api';

const SearchTools = ({ setTools }) => {
    return (
        <Formik
            initialValues={{ search: '', max_price: '' }}
            onSubmit={async (values) => {
                const params = new URLSearchParams();
                if (values.search) params.append('search', values.search);
                if (values.max_price) params.append('max_price', values.max_price);
                
                const filteredTools = await api.get(`/tools?${params.toString()}`)
                    .then(res => res.data);
                setTools(filteredTools);
            }}
        >
            <Form className="search-form">
                <Field name="search" placeholder="Search tools..." />
                <Field name="max_price" type="number" placeholder="Max price ($)" />
                <button type="submit">Filter</button>
            </Form>
        </Formik>
    );
};

export default SearchTools;