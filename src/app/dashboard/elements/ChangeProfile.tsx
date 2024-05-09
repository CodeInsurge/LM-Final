"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FetchingNamesFL from "./FetchNames";

const UpdateProfilePhoto = () => {

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State to control the Profile modal

    const [selectedprofileFile, setSelectedprofileFile] = useState<File | null>(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

    // Get the email from localStorage
    const tokenInfo = localStorage.getItem('token-info');
    if (tokenInfo === null) {
        throw new Error("Token info not found in local storage.");
    }
    const tokenInfoObject = JSON.parse(tokenInfo);
    const emailprofile = tokenInfoObject.email;

    const handleFileprofileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedprofileFile(files[0]);
        }
    }

    useEffect(() => {
        const fetchProfilePhotoUrl = async () => {
            try {
                // Fetch profile photo as a Blob from the backend
                const response = await axios.get(`http://localhost:8081/profile-photo-url?email=${emailprofile}`, {
                    responseType: 'blob',
                });

                // Create an object URL for the Blob and update the state
                setProfilePhotoUrl(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Failed to fetch profile photo URL:", error);
            }
        };

        // Call the fetchProfilePhotoUrl function when the component mounts
        fetchProfilePhotoUrl();
    }, []); // Make sure to pass any dependencies here if needed


    const handleSaveProfilePhoto = async () => {
        if (!selectedprofileFile) {
            // Handle case where no file is selected
            return;
        }

        const formData = new FormData();
        formData.append('email', emailprofile);
        formData.append('profilePhoto', selectedprofileFile);

        try {
            // Send a POST request to upload the profile photo
            await axios.post('http://localhost:8081/ChangeProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update profile photo URL in real-time
            const updatedProfilePhotoResponse = await axios.get(`http://localhost:8081/profile-photo-url?email=${emailprofile}`, {
                responseType: 'blob',
            });
            setProfilePhotoUrl(URL.createObjectURL(updatedProfilePhotoResponse.data));

            // Close the profile photo modal
            setIsProfileModalOpen(false);

        } catch (error) {
            // Handle error
            console.error('Failed to upload profile photo:', error);
        }
    }
    return (
        <>
            <div className="relative py-16 bg-blueGray-200">
                <div className="container mx-auto px-4 flex flex-col items-center lg:block">
                    <div className="px-9 mb-6 -mt-[94px] ">
                        <div className="absolute cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="19" fill="#D8D5D6" stroke="#FEFEFF" stroke-width="2" />
                                <g clip-path="url(#clip0_812_7954)">
                                    <path d="M24.0416 13.6469L23.0441 12.3538C22.8455 12.0981 22.5912 11.891 22.3006 11.7482C22.01 11.6053 21.6908 11.5305 21.367 11.5293H18.6394C18.3156 11.5305 17.9964 11.6053 17.7058 11.7482C17.4152 11.891 17.1609 12.0981 16.9623 12.3538L15.9648 13.6469H24.0416Z" fill="#4C4448" />
                                    <path d="M20.0032 24.2349C21.5626 24.2349 22.8267 22.9708 22.8267 21.4114C22.8267 19.852 21.5626 18.5879 20.0032 18.5879C18.4438 18.5879 17.1797 19.852 17.1797 21.4114C17.1797 22.9708 18.4438 24.2349 20.0032 24.2349Z" fill="#4C4448" />
                                    <path d="M24.943 15.0586H15.0607C14.1249 15.0597 13.2279 15.4319 12.5662 16.0936C11.9046 16.7552 11.5324 17.6523 11.5313 18.588L11.5312 24.9409C11.5324 25.8766 11.9046 26.7737 12.5662 27.4354C13.2279 28.097 14.1249 28.4692 15.0607 28.4703H24.943C25.8787 28.4692 26.7758 28.097 27.4374 27.4354C28.0991 26.7737 28.4713 25.8766 28.4724 24.9409V18.588C28.4713 17.6523 28.0991 16.7552 27.4374 16.0936C26.7758 15.4319 25.8787 15.0597 24.943 15.0586ZM20.0018 25.6468C19.1642 25.6468 18.3453 25.3984 17.6488 24.933C16.9523 24.4677 16.4095 23.8062 16.0889 23.0323C15.7684 22.2584 15.6845 21.4068 15.8479 20.5853C16.0113 19.7637 16.4147 19.009 17.007 18.4167C17.5993 17.8244 18.354 17.421 19.1756 17.2576C19.9971 17.0942 20.8487 17.1781 21.6226 17.4986C22.3965 17.8192 23.058 18.362 23.5234 19.0585C23.9887 19.755 24.2371 20.5739 24.2371 21.4115C24.236 22.5345 23.7894 23.6111 22.9954 24.4051C22.2014 25.1991 21.1248 25.6457 20.0018 25.6468Z" fill="#4C4448" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_812_7954">
                                        <rect width="16.9412" height="16.9412" fill="white" transform="translate(11.5312 11.5293)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        {isProfileModalOpen && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white rounded-[30px] p-8 m-[20px]">
                                    {/* Add modal content here */}
                                    <form>
                                        <label htmlFor="fileInputprofile" className="cursor-pointer">
                                            <input
                                                id="fileInputprofile"
                                                type="file"
                                                accept="image/*"
                                                name="profilePhoto"
                                                onChange={handleFileprofileChange} />
                                        </label>
                                    </form>

                                    <div className="flex gap-[20px] mt-[30px]">
                                        <button
                                            onClick={handleSaveProfilePhoto}
                                            className="rounded-[34px] font-[poppins] mt-[10px] w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsProfileModalOpen(false)}
                                            className="rounded-[34px] font-[poppins] mt-[10px] w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {profilePhotoUrl ? (
                            <img
                                src={profilePhotoUrl}
                                alt="Profile"
                                className="h-40 w-40 object-cover rounded-full border border-white-300"
                            />
                        ) : (
                            <div className="h-40 w-40 bg-gray-200 flex justify-center items-center rounded-full border border-gray-300">

                            </div>
                        )}

                    </div>
                    <div className="fle_dir_col flex justify-between items-center mt-12 ml-5 border-b border-blueGray-200">
                        <FetchingNamesFL />
                        <div className="btn">
                            <Link to="/mainprofile">
                                <button className="flex items-center justify-center px-4 py-2 bg-[#38589C] text-white rounded-md hover:opacity-75 shadow-md hover:bg-[#38589C] focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" viewBox="0 0 15 17" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0456 1.61851C10.3971 1.93726 10.4542 2.51867 10.1729 2.91712L6.2325 8.49935L10.1729 14.0816C10.4541 14.48 10.3971 15.0614 10.0456 15.3802C9.69401 15.6989 9.181 15.6343 8.89974 15.2359L4.55194 9.07651C4.31375 8.73908 4.31375 8.25962 4.55194 7.92219L8.89974 1.7628C9.181 1.36435 9.69401 1.29975 10.0456 1.61851Z" fill="white" />
                                    </svg>
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProfilePhoto;