"use client"
import { Link, useNavigate } from "react-router-dom";
import Image from "next/image";
import React, { useState } from 'react';
import SignupValidation from "./SignupValidation";
import axios from "axios"
import withLoadingsppiner from '../../loader/customhook';

const Register = () => {
    const [existEmail, setexistEmail] = useState("");
    // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    // const [currentPassword, setCurrentPassword] = useState('');

    // const toggleCurrentPasswordVisibility = () => {
    //     setShowCurrentPassword(!showCurrentPassword);
    // };
    interface NewFormInstant {
        email: string,
        password: string,
        f_name: string,
        l_name: string,
        u_name: string,
    }
    const navigate = useNavigate();
    const [values, SetValues] = useState({
        f_name: "", l_name: "", u_name: "", email: "", password: ""
    })

    const [errors, setErrors] = useState<NewFormInstant>({
        f_name: "", l_name: "", u_name: "", email: "", password: ""
    });

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.currentTarget; // Use currentTarget instead of target
        SetValues(prev => ({ ...prev, [name]: value })); // Update the state with the currentTarget's name and value
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = SignupValidation(values);
        setErrors(validationErrors as NewFormInstant);
        if (errors.email !== "" && errors.f_name !== "" && errors.l_name !== "" && errors.u_name !== "" && errors.password !== "") {
            axios.post("http://localhost:8081/register", values)
                .then((res) => {
                    navigate("/Login")
                    console.log(res);
                }).catch((err) => {
                    if (err.response && err.response.status === 400) {
                        setexistEmail("Email Already Exist. Please Choose Another Email")
                    } else {
                        console.log(err);
                    }
                });
        }
    }

    // alert dimissing
    function dissmissemail() {
        setErrors(dissmiserrors => ({ ...dissmiserrors, email: '' }));
    }
    function dissmisspassword() {
        setErrors(dissmiserrors => ({ ...dissmiserrors, password: '' }));
    }
    function dissmissf_name() {
        setErrors(dissmiserrors => ({ ...dissmiserrors, f_name: '' }));
    }
    function dissmissl_name() {
        setErrors(dissmiserrors => ({ ...dissmiserrors, l_name: '' }));
    }
    function dissmissu_name() {
        setErrors(dissmiserrors => ({ ...dissmiserrors, u_name: '' }));
    }
    return (
        <>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1">
                <div className="flex items-center justify-center bg-[#F5F5F5] lg:p-[50px] md:p-[50px] py-[80px]">
                    <div className="w-full md:w-[75%] lg:w-[75%] rounded-[30px] bg-[white] px-3  py-[70px] lg:py-8 md:py-8 lg:px-8 md:px-8">
                        <form action="" onSubmit={handleSubmit}>
                            <h2 className="text-4xl font-[poppins] text-center font-bold leading-normal mb-2 text-[#4C4448] mb-2">Register</h2>
                            <p className="text-[#62585D] font-[poppins] text-center">Register to continue with mealmaze</p>
                            <div className="flex flex-col gap-[15px] pt-[40px] px-[20px]">
                                <div className="flex gap-[20px] pt-[20px]">
                                    <div className="w-[100%]">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                                        <input
                                            type="text"
                                            id="f_name"
                                            name="f_name"
                                            onChange={handleInput}
                                            placeholder="First Name"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                        />
                                    </div>
                                    <div className="w-[100%]">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            id="l_name"
                                            name="l_name"
                                            onChange={handleInput}
                                            placeholder="Last Name"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-[30px]">
                                    {/* alert for f_name error */}
                                    {errors.f_name &&
                                        <div id="alert-border-1" className="w-[100%] flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <div className="ms-3 text-sm font-medium">
                                                {errors.f_name}
                                            </div>
                                            <button type="button" onClick={dissmissf_name} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                                <span className="sr-only">Dismiss</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                    {/* alert for l_name error */}
                                    {errors.l_name &&
                                        <div id="alert-border-1" className="w-[100%] flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <div className="ms-3 text-sm font-medium">
                                                {errors.l_name}
                                            </div>
                                            <button type="button" onClick={dissmissl_name} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                                <span className="sr-only">Dismiss</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="flex gap-[20px]">
                                    <div className="w-[100%]">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                        <input
                                            type="text"
                                            id="u_name"
                                            name="u_name"
                                            onChange={handleInput}
                                            placeholder="Username"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                        />
                                    </div>
                                    <div className="w-[100%]">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            onChange={handleInput}
                                            placeholder="Email"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-[30px]">
                                    {/* alert for f_name error */}
                                    {errors.u_name &&
                                        <div id="alert-border-1" className="w-[100%] flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <div className="ms-3 text-sm font-medium">
                                                {errors.u_name}
                                            </div>
                                            <button type="button" onClick={dissmissu_name} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                                <span className="sr-only">Dismiss</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                    {/* alert for l_name error */}
                                    {errors.email &&
                                        <div id="alert-border-1" className="w-[100%] flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <div className="ms-3 text-sm font-medium">
                                                {errors.email}
                                            </div>
                                            <button type="button" onClick={dissmissemail} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                                <span className="sr-only">Dismiss</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="relative">
                                    <label htmlFor="name" className="font-[poppins] block text-gray-700 text-sm font-semibold mb-2">Password</label>
                                    <input
                                        // type={showCurrentPassword ? 'text' : 'password'}
                                        // value={currentPassword}
                                        // onChange={(e) => setCurrentPassword(e.target.value)}
                                        type="password"
                                        onChange={handleInput}
                                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Password"
                                        name="password"
                                    />
                                    <button
                                        // onClick={toggleCurrentPasswordVisibility}
                                        className="absolute top-[26px] bottom-[0px] right-[9px] flex items-center px-2 focus:outline-none"
                                    >
                                    </button>
                                </div>
                                {existEmail && (
                                    <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">{existEmail}.</p>
                                )}
                                {/* alert for email  error */}
                                {errors.password &&
                                    <div id="alert-border-1" className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                        </svg>
                                        <div className="ms-3 text-sm font-medium">
                                            {errors.password}
                                        </div>
                                        <button type="button" onClick={dissmisspassword} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                            <span className="sr-only">Dismiss</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                }
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="checkbox" name="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                                        <label htmlFor="checkbox" className="ml-2 text-[14px] text-gray-700 font-[poppins]">Accept <span className="text-[#2F80ED] font-[poppins] font-semibold">Terms & Condition</span></label>
                                    </div>
                                    <div className="">
                                        <Link to="">
                                            <p className="text-[#2F80ED] text-[14px] font-[poppins] font-semibold">Forgot Password?</p>
                                        </Link>
                                    </div>
                                </div>
                                <button type="submit" className="rounded-[20px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[30px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Register
                                </button>
                                <p className="text-[#62585D] font-[poppins] text-center">Already have an account? <Link to="/login"><span className="text-[#2F80ED]">Login here</span></Link></p>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="bg-gradient-to-r from-[#FFFFFF] to-[#BBD1FF] flex justify-center items-center py-[80px]">
                        <img src="https://smellmeloveme.shop/wp-content/uploads/2024/02/Frame-1000004442.png" alt="kuch bhi" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default withLoadingsppiner(Register);