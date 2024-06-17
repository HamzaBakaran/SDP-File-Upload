import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { registerUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: string;
    username?: string; // Optional since we will set it programmatically
}

const schema = yup
    .object({
        firstName: yup.string().required("First name is required."),
        lastName: yup.string().required("Last name is required."),
        email: yup.string().email().required("Email is required."),
        password: yup.string().min(8).required("Password is required and it should be a minimum of 8 characters."),
        userType: yup.string().required()
    })
    .required();

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(schema)
    });

    const { loading, userToken, error, success } = useSelector(
        (state: RootState) => state.auth
    );

    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = (data: RegisterFormData) => {
        // Set username to be the same as email
        const userData = { ...data, username: data.email }
        dispatch(registerUser(userData))
    }

    const navigate = useNavigate();

    useEffect(() => {
        // Redirect user to login page if registration was successful
        if (success) {
            toast.success('Registration successful');
            navigate('/login')
        }
        // Redirect authenticated user to home screen
        if (userToken) navigate('/home')
    }, [navigate, userToken, success]);

    useEffect(() => {
        if (error) {
            const errorMessage = (error as Error).toString(); // Type assertion
            toast.error(`Error registering user: ${errorMessage}`);
        }
    }, [error]);

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '10vh' }}>
            <Row className="w-100">
                <Col xs={12} md={8} lg={6} className="mx-auto">
                    <Card className="shadow p-3">
                        <Card.Body>
                            <Card.Title className="text-center mb-3">Register</Card.Title>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="firstName">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control type="text" {...register("firstName")} isInvalid={!!errors.firstName} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="lastName">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control type="text" {...register("lastName")} isInvalid={!!errors.lastName} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Control type="hidden" value="GUEST" {...register("userType")} />
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" className="w-100" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <Link to="/login" style={{ color: 'gray', textDecoration: 'none' }}>
                                    Already have an account? Log in here
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Registration;
