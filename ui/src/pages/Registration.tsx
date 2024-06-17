import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { registerUser } from "../store/authSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { toast } from 'react-toastify';

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
        password: yup.string().min(8).required("Password is required and it shoud be minimum of 8 characters."),
        userType: yup.string().required()
    })
    .required()

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(schema)
    })

    const { loading, userToken, error, success } = useSelector(
        (state: RootState) => state.auth
    )

    const dispatch = useDispatch<AppDispatch>()

    const onSubmit = (data: RegisterFormData) => {
        // Set username to be the same as email
        const userData = { ...data, username: data.email }
        dispatch(registerUser(userData))
    }

    const navigate = useNavigate()

    useEffect(() => {
        // Redirect user to login page if registration was successful
        if (success) {
            toast.success('Registration successful');
            navigate('/login')
        }
        // Redirect authenticated user to home screen
        if (userToken) navigate('/home')
    }, [navigate, userToken, success])

    if (error) {
        const errorMessage = (error as Error).toString(); // Type assertion
        toast.error(`Error registering user: ${errorMessage}`);
    }

    return (
        <>
            <div className="col-12 col-md-3 m-2">
                <div className="card p-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">First name</label>
                            <input type="text" className="form-control" {...register("firstName")} />
                            {errors.firstName && <small style={{ color: "red" }}>{errors.firstName.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last name</label>
                            <input type="text" className="form-control" {...register("lastName")} />
                            {errors.lastName && <small style={{ color: "red" }}>{errors.lastName.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" {...register("email")} />
                            {errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}
                        </div>
                        <input type="hidden" value="GUEST" {...register("userType")} />
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" {...register("password")} />
                            {errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Registration
