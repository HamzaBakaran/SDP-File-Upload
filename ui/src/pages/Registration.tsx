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
    username: string;
    userType: string;
 }
 const schema = yup
   .object({
       firstName: yup.string().required("First name is required."),
       lastName: yup.string().required(),
       email: yup.string().email().required(),
       username: yup.string().min(6).max(20).required(),
       password: yup.string().min(8).required(),
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
       dispatch(registerUser(data))
    }
    
    const navigate = useNavigate()

   useEffect(() => {
   // Redirect user to login page if registration was successful
      if (success) 
      {
        toast.success('Registration successful');
        navigate('/login')
   }
   // Redirect authenticated user to home screen
      if (userToken) navigate('/home')
}, [navigate, userToken, success])

if(error){
    const errorMessage = (error as Error).toString(); // Type assertion
      toast.error(`Error registrating order: ${errorMessage}`);
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
           <label className="form-label">Username</label>
           <input type="text" className="form-control" {...register("username")} />
           {errors.username && <small style={{ color: "red" }}>{errors.username.message}</small>}
         </div>
         <div className="mb-3">
           <label className="form-label">Email address</label>
           <input type="email" className="form-control" {...register("email")}/>
           {errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}
         </div>
         <input type="hidden" value="GUEST" {...register("userType")} />

         <div className="mb-3">
           <label className="form-label">Password</label>
           <input type="password" className="form-control" {...register("password")}/>
           {errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}
         </div>
         <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
         { loading ? 'Submitting...' : 'Submit' }
       </form>
     </div>
   </div>
   </>
 )
}


export default Registration
