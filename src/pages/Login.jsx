import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../Fonts/fonts.css'
import axios from 'axios'
import Cookies from 'js-cookie'

const Login = () => {
    const navigate = useNavigate();

    const axiosWithCredentials = axios.create({
        withCredentials: true,
    });

    const axiosWithoutCredentials = axios.create({
        withCredentials: false,
    });

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Username is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000))

                const response = await axiosWithCredentials.post(
                    "http://localhost:5000/login",
                    values
                );

                if (response.data.message === "Successfully login") {
                    Cookies.set("user_id", response.data.userInfo.user_id);
                    console.log(response.data.userInfo.user_id)
                    navigate(`/contacts/${response.data.userInfo.user_id}`)
                }

            } catch (error) {
                console.error(error);
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
                            <div className="">
                                <label className="block text-sm text-white" htmlFor="username">Username</label>
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
                            <div className="mt-2">
                                <label className="block text-sm text-white" htmlFor="password">Password</label>
                                <input
                                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
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

                            <div className="mt-4 items-center flex justify-between">
                                <button
                                    className="px-4 py-2 text-white font-light tracking-wider bg-orange-500 hover:bg-gray-800 rounded"
                                    type="submit"
                                >
                                    Login
                                </button>
                                <a
                                    className="inline-block right-0 align-baseline font-bold text-sm text-500 text-white hover:text-red-400"
                                    href="#"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="inline-block right-0 align-baseline font-light text-sm text-white  text-500 hover:text-orange-400 cursor-pointer"
                                >
                                    Create an account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
