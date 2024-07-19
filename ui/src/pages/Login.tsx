import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { login } from '../store/authSlice';
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';

export type LoginFormData = {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required("Email is required."),
    password: yup.string().required("Password is required.")
  })
  .required();

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const { loading, userToken, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      toast.success('Login successful');
      navigate('/dashboard');
    }
  }, [navigate, userToken]);

  useEffect(() => {
    if (error) {
      const errorMessage = (error as Error).toString(); // Type assertion
      if (errorMessage) {
        toast.error(`Error logging in: ${errorMessage}`);
      }
    }
  }, [error]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '10vh' }}>
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow p-3">
            <Card.Body>
              <Card.Title className="text-center mb-3">Log In</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Log In'}
                </Button>
              </Form>
              <div className="text-center">
                <Link to="/register" style={{ color: 'gray', textDecoration: 'none' }}>
                  Don't have an account? Register here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
