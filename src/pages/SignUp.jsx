import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const navigate = useNavigate();
    const axiosWithCredentials = axios.create({
        withCredentials: true,
      });
      
      const axiosWithoutCredentials = axios.create({
        withCredentials: false,
      });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            userName: Yup.string().required('Username is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: async(values, {resetForm})  => {
           try{
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await axios.post('http://localhost:5000/register', values);

            if(response.data.message === "User registered successfully"){
                Cookies.set("userName", response.data.userName);
                navigate('/login');
                resetForm();
            }else{
                console.log(response.data.message)
            }
           }catch (error){
            console.error("may error", error)
           }
        },
    });

    return (
        <div className="h-screen font-sans login bg-cover">
            <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                <div className="w-full max-w-lg">
                    <div className="">
                        <form onSubmit={formik.handleSubmit} className="m-4 p-10 bg-gray-700 bg-opacity-25 rounded shadow-xl">
                            <p className="text-white text-center text-2xl font-bold" style={{ fontFamily: 'Curetro' }}>Welcome to <span className='text-3xl'>Chat</span> <span className='px-3 py-2 bg-orange-500 font-bold rounded-md text-3xl'>Hub</span></p>
                            <div className='grid grid-cols-6 gap-4 pt-3'>
                                <div className="col-span-3">
                                    <label className="block text-sm text-white" htmlFor="firstName">First Name</label>
                                    <input
                                        className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                        <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
                                    ) : null}
                                </div>
                                <div className='col-span-3'>
                                    <label className="block  text-sm text-white" htmlFor="lastName">Last Name</label>
                                    <input
                                        className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.lastName}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                        <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
                                    ) : null}
                                </div>
                                <div className='col-span-6'>
                                    <label className="block  text-sm text-white" htmlFor="username">Username</label>
                                    <input
                                        className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        placeholder="Enter your username"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.userName}
                                    />
                                    {formik.touched.userName && formik.errors.userName ? (
                                        <div className="text-red-500 text-sm">{formik.errors.userName}</div>
                                    ) : null}
                                </div>
                                <div className='col-span-6'>
                                    <label className="block  text-sm text-white" htmlFor="password">Password</label>
                                    <input
                                        className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mt-4 items-center flex justify-between">
                                <button
                                    className="px-4 py-2 text-white font-bold tracking-wider bg-orange-500 hover:bg-orange-600  rounded"
                                    type="submit"
                                >
                                    Create account
                                </button>
                            </div>
                            <div className="text-center">
                                <button onClick={() => navigate('/login')} className="inline-block text-white right-0 align-baseline font-light text-sm text-500 hover:text-orange-400 cursor-pointer">
                                    Go back to login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
