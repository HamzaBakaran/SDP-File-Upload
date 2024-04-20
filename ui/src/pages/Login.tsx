import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { login } from '../store/authSlice'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { toast } from 'react-toastify';




export type LoginFormData = {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required()
  })
  .required()


const Login = () => {

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: yupResolver(schema)
})

const { loading, userToken, error } = useSelector((state: RootState) => state.auth)
const dispatch = useDispatch<AppDispatch>()

const onSubmit = (data: LoginFormData) => {
  dispatch(login(data))
}

const navigate = useNavigate()

useEffect(() => {
  // Redirect user to login page if registration was successful
     if (userToken) 
     {
       toast.success('Login successful');
       navigate('/home')
  }
}, [navigate, userToken])


if (error) {
  const errorMessage = (error as Error).toString(); // Type assertion
  if (errorMessage) {
    toast.error(`Error registering order: ${errorMessage}`);
  }
}


  return (
<>
<div className="container">
  <div className="row">
    <div className="col-12 col-md-6 mx-auto">
      <div className="card p-2">
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="string" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" {...register("email")}/>
            {errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1"  {...register("password")}/>
            {errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
          {loading ? 'Submitting...' : 'Log in'}
        </form>
      </div>
    </div>
  </div>
</div>
</>
  )
}

export default Login