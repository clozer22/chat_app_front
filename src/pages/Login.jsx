import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../Fonts/fonts.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import Loading from '../components/Loading/Loading';
import ErrorModal from '../components/Modals/ErrorModal';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showAlertNotExist, setshowAlertNotExist] = useState(false)
    const [showPassword, setShowPassword] = useState(false); 
    const isCreated = Cookies.get("loginSuccess")


    const accountCreated = () => toast.success("Successfully Registered")
    const wrongPass = () => toast.error("Wrong username/password combination!")

    useEffect(() => {
        if(isCreated){
            accountCreated()
            setTimeout(() => {
                Cookies.remove("loginSuccess")
            })
        }
    },[isCreated])
    


    const axiosWithCredentials = axios.create({
        withCredentials: true,
      });
      

    const axiosWithoutCredentials = axios.create({
        withCredentials: false,
    });

    useEffect(() => {
        const verified = Cookies.get("verified");

        if(verified){

        }
    })

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
            setIsLoading(true)
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000))

                const response = await axiosWithCredentials.post(
                    `/login`,
                    values
                );
                if(response.data.message === "Wrong username/password combination!"){
                    wrongPass()
                     return;
                }

                if(response.data.message === "Username is not exist"){
                    setshowAlertNotExist(true)
                    return;
                }

                if (response.data.message === "Successfully login") {
                    Cookies.set("user_id", response.data.userInfo.user_id);
                    Cookies.set("LoggedIn", true);
                    console.log(response.data.userInfo.user_id)
                    setShowAlert(false); 
                    navigate(`/`)
                }

            } catch (error) {
                console.error(error);
            }finally{
                setIsLoading(false)
            }
        }, 
    });

    // useEffect(() => {
    //     if(Cookies.get("user_id")){
    //       navigate('/')
    //     }
    //   },[])
    const passRes = Cookies.get("passReset")

    const passUpdated = () => toast.success("Your password is now updated")

    useEffect(() => {
        if(passRes){
            passUpdated()
            setTimeout(() => {
                Cookies.remove("passReset")
            }, 3000)
        }
    }, [passRes])

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState); // Toggle password visibility
    };

    return (
        <div className="h-screen font-sans login bg-cover">
        {showAlert ? <ErrorModal setShowAlert1={setShowAlert} label="Wrong username/password combination!" /> : null}
        {showAlertNotExist ? <ErrorModal setShowAlert1={setShowAlert} label="Username doesn't exist." /> : null}
        <ToastContainer />
            <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                <div className="w-full max-w-lg">
                    <div className="">
                        <form onSubmit={formik.handleSubmit} className="m-4 p-10 bg-gray-800 bg-opacity-35 rounded shadow-xl">
                            <p className="text-white text-center text-2xl font-bold tracking-wider" style={{ fontFamily: 'Curetro' }}>Welcome to <span className='text-3xl'>Chat</span> <span className='px-3 py-2 bg-orange-500 font-bold rounded-md text-3xl'>Hub</span></p>
                            <div className="">
                                <label className="block text-sm text-white" htmlFor="username">Username</label>
                                <input
                                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                    autoComplete='username'
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
                            <div className="mt-2 relative">
                                <label className="block text-sm text-white" htmlFor="password">Password</label>
                                <input
                                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                    type={showPassword ? "text" : "password"} // Show password if showPassword is true
                                    id="password"
                                    name="password"
                                    autoComplete='current-password'
                                    placeholder="Enter your password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            <span
                                className="absolute inset-y-0 right-0 top-[1.2rem] flex items-center pr-3 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <AiOutlineEye className='text-2xl' /> : <AiOutlineEyeInvisible className='text-2xl' />}
                            </span>
                                
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            <div className="mt-4 items-center flex justify-between">
                                <button
                                    className="px-4 py-2 text-white font-light tracking-wider bg-orange-500 hover:bg-orange-700 duration-300 rounded"
                                    type="submit"
                                    style={{ fontFamily: 'Curetro' }}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/verify')}
                                    className="inline-block right-0 align-baseline font-bold text-sm text-500 text-white duration-300 hover:text-orange-500"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="inline-block right-0 align-baseline font-light text-sm text-white  text-500 duration-300 hover:text-orange-500 cursor-pointer"
                                    
                                >
                                    Create an account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    );
}

export default Login;
