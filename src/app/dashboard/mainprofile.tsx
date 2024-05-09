"use client"
import React, { ChangeEvent, useState, useEffect } from "react";
import Image from "next/image";
import { Link, useNavigate } from "react-router-dom";
import withLoadingsppiner from '../loader/customhook';
import Iconsvgdark from "../components/icons/icon_dark"
import CartIcon from "../components/icons/cartnew";
import Editicon from "../components/icons/editicon";
import DeleteIcon from "../components/icons/delete";
import Shareicon from "../components/icons/shareIcon";
import axios from "axios";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,

} from '@chakra-ui/react'


const Mainprofile = () => {

    const [ProfilePhotoUrl, setProfilePhotoUrl] = useState('');
    const [CoverPhotoUrl, setCoverPhotoUrl] = useState('');
    const [UserProfileName, setUserProfileName] = useState({ f_name: "", l_name: "", u_name: "" })
    const [isModalOpenMarker, setIsModalOpenMarker] = useState(false)
    const [selectedprofileFile, setSelectedprofileFile] = useState<File | null>(null);
    const [markerPrfile, setMarkerProfile] = useState("");
    const [isnameEmpty, setIsNameEmpty] = useState(false); // State to track if the Phone is empty
    const [markerAlertOpen, setmarkerAlertOpen] = useState(false);
    const [Createdmarker, setCreatedmarker] = useState<Array<{ m_id: string; m_name: string; createdAt: string }>>([]);

    // save_address post query for databse
    const [mark_name, setmark_name] = useState({
        m_name: '',
    });

    const navigate = useNavigate();
    // setting the username state is always null; 
    const [loading, setLoading] = useState(false);

    // Get the email from localStorage
    const tokenInfo = localStorage.getItem('token-info');
    if (tokenInfo === null) {
        throw new Error("Token info not found in local storage.");
    }
    const tokenInfoObject = JSON.parse(tokenInfo);
    const emailprofile = tokenInfoObject.email;

    // Function to handle logout
    const handleLogout = async () => {
        setLoading(true);
        try {
            localStorage.removeItem("token-info");
            // Redirect to the login page or any other page
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Handle logout failure
        } finally {
            setLoading(false);
        }
    };

    const handleFileprofileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedprofileFile(files[0]);
        }
    }

    useEffect(() => {
        const fetchProfilePhotoUrl = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/main-profile-url?email=${emailprofile}`);
                const imageData = response.data;

                // Set profile and cover photo URLs in state
                setProfilePhotoUrl(`data:image/jpeg;base64,${imageData.profile_photo_url}`);
                setCoverPhotoUrl(`data:image/jpeg;base64,${imageData.cover_photo_url}`);
                setUserProfileName({ f_name: imageData.f_name, l_name: imageData.l_name, u_name: imageData.u_name });
            } catch (error) {
                console.error("Failed to fetch profile photo URL:", error);
            }
        };

        fetchProfilePhotoUrl();
    }, []);

    useEffect(() => {
        const allMarkersFetch = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/update-marker-url?email=${emailprofile}`);

                setCreatedmarker(response.data ? [response.data] : []);
                setMarkerProfile(`data:image/jpeg;base64,${response.data.marker_profile}`);
                
            } catch (error) {
                console.error("Failed to fetch profile photo URL:", error);
            }
        };

        allMarkersFetch();
    }, []);

    const handleSaveProfilePhoto = async () => {
        if (!mark_name.m_name) {
            // Set corresponding state variables to true if the fields are empty
            setIsNameEmpty(true);
            return; // Stop further execution if any field is empty
        }

        if (!selectedprofileFile) {
            // Handle case where no file is selected
            return;
        }

        const formData = new FormData();
        formData.append('m_name', mark_name.m_name);
        formData.append('marker_profile', selectedprofileFile);

        try {
            // Send a POST request to upload the profile photo
            await axios.post(`http://localhost:8081/update-marker?email=${emailprofile}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear the selected file after successful upload
            setSelectedprofileFile(null);

            // Update profile details after upload
            const updatedProfileDetailsResponse = await axios.get(`http://localhost:8081/update-marker-url?email=${emailprofile}`);

            // Set marker profile and name state
            setMarkerProfile(`data:image/jpeg;base64,${updatedProfileDetailsResponse.data.marker_profile}`);
            // setMarkerNames({
            //     m_name: updatedProfileDetailsResponse.data.marker_name,
            //     createdAt: updatedProfileDetailsResponse.data.createdAt
            // });
            setCreatedmarker([...Createdmarker, {
                m_id: updatedProfileDetailsResponse.data.marker_id, // assuming you get the marker ID from the backend
                m_name: updatedProfileDetailsResponse.data.marker_name,
                createdAt: updatedProfileDetailsResponse.data.createdAt
            }])
            setIsModalOpenMarker(false);
            setIsNameEmpty(false);
            setmarkerAlertOpen(true);
        } catch (error) {
            // Handle error
            console.error('Failed to upload profile photo:', error);
        }
    }

    // Event handler to update name data
    const handleMarker_Names = (e: React.ChangeEvent<HTMLInputElement>) => {
        setmark_name({
            ...mark_name,
            [e.target.name]: e.target.value
        });
    };

    const dismiss = () => {
        setmarkerAlertOpen(false);
    }

    return (
        <>
            <main className="profile-page ">
                <section className="relative block h-[300px]">
                    <div className="flex flex-col">
                        {CoverPhotoUrl ? (
                            <img
                                src={CoverPhotoUrl}
                                alt="Cover Photo"
                                className="h-[350px] w-full object-cover border border-gray-300" />
                        ) : (
                            <div className="h-[350px] w-full bg-gray-200 flex justify-center items-center border border-gray-300">
                                <p className="text-center text-[gray] font-[poppins] text-lg font-semibold">No items to show.</p>
                            </div>
                        )}
                    </div>
                </section>
                <section className="relative py-16 bg-blueGray-200">
                    <div className="container mx-auto px-4 flex flex-col items-center lg:block">
                        <div className="px-9 mb-6 -mt-[94px] ">
                            {ProfilePhotoUrl ? (
                                <img
                                    src={ProfilePhotoUrl}
                                    alt="Profile"
                                    className="h-40 w-40 object-cover rounded-full border border-white-300"
                                />
                            ) : (
                                <div className="h-40 w-40 bg-gray-200 flex justify-center border-white-300 items-center rounded-full border border-gray-300">

                                </div>
                            )}

                        </div>
                        <div className="fle_dir_col flex justify-between items-center mt-12 ml-5 border-b border-blueGray-200">
                            <div className="">
                                {UserProfileName ? (
                                    <h3 className="text-[25px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                                        {UserProfileName.f_name} {UserProfileName.l_name}
                                    </h3>
                                ) : (
                                    <h3 className="text-[25px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                                        ...Loading
                                    </h3>
                                )}
                                {UserProfileName ? (
                                    <p className="text-center lg:text-left text-sm leading-normal mt-0 mb-2 text-blueGray-400 text-[#888587] font-bold uppercase">
                                        {UserProfileName.u_name}
                                    </p>
                                ) : (
                                    <p className="text-center lg:text-left text-sm leading-normal mt-0 mb-2 text-blueGray-400 text-[#888587] font-bold uppercase">
                                        ...Loading
                                    </p>
                                )}

                            </div>
                            <div className="btn flex gap-[20px] mb-[20px]">
                                <button onClick={handleLogout} className="flex items-center justify-center px-4 py-2 bg-[#D8D5D6] text-black rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-500" >Logout</button>
                                <Link to="/profile">
                                    <button className="flex items-center justify-center px-4 py-2 bg-[#D8D5D6] text-black rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                            <path d="M11.659 4.00836C12.2551 3.36247 12.5532 3.03952 12.8699 2.85114C13.6342 2.39661 14.5753 2.38247 15.3523 2.81386C15.6743 2.99264 15.9816 3.3065 16.596 3.93421C17.2105 4.56192 17.5177 4.87578 17.6928 5.20474C18.115 5.99849 18.1012 6.95983 17.6563 7.74056C17.4719 8.06413 17.1557 8.36862 16.5234 8.97761L9.0005 16.2234C7.8023 17.3775 7.2032 17.9545 6.45445 18.247C5.7057 18.5394 4.88256 18.5179 3.23629 18.4749L3.0123 18.469C2.51112 18.4559 2.26054 18.4493 2.11487 18.284C1.9692 18.1187 1.98909 17.8635 2.02886 17.3529L2.05046 17.0757C2.16241 15.6388 2.21838 14.9204 2.49897 14.2746C2.77955 13.6288 3.26355 13.1044 4.23154 12.0556L11.659 4.00836Z" stroke="#141B34" stroke-width="1.25" stroke-linejoin="round" />
                                            <path d="M10.7969 4.10059L16.3969 9.70059" stroke="#141B34" stroke-width="1.25" stroke-linejoin="round" />
                                            <path d="M11.6016 18.5L18.0016 18.5" stroke="#141B34" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                {/* newsec */}
                <div className="container mx-auto w-full p-[30px] mb-[50px]">
                    <div className="fle_dir_col flex justify-between items-center lg:pb-5 ml-5 mb-[50px] border-b border-blueGray-200">
                        <div className="">
                            <h3 className="text-[25px] lg:text-[36px] font-[poppins] font-semibold leading-normal mb-2 text-[#4C4448] mb-2">
                                Legacy Markers
                            </h3>
                        </div>
                        <div className="btn flex gap-[20px]">
                            <Link to="">
                                <button className="flex items-center justify-center font-[poppins] rounded-[50px] bg-[#E8EEFB] w-full h-14 py-[13px] px-5 text-base tracking-[2px] font-[poppins] font-semibold text-[#38589C] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.05345 17.1128C5.36832 17.1128 3.8491 16.0977 3.20412 14.5409C2.55914 12.9841 2.91539 11.192 4.10678 10.0003L5.87512 8.23193L7.05345 9.41026L5.28595 11.1778C4.65433 11.8094 4.40766 12.73 4.63885 13.5928C4.87004 14.4556 5.54396 15.1295 6.40676 15.3607C7.26957 15.5919 8.19017 15.3452 8.82178 14.7136L10.5893 12.9461L11.7676 14.1253L10.0001 15.8928C9.22018 16.6765 8.15916 17.1158 7.05345 17.1128ZM7.64262 13.5353L6.46428 12.3569L12.3568 6.46443L13.5351 7.64276L7.64345 13.5344L7.64262 13.5353ZM14.1251 11.7678L12.946 10.5894L14.7135 8.82193C15.3537 8.1922 15.6069 7.26748 15.377 6.39941C15.147 5.53134 14.4691 4.8533 13.6011 4.62313C12.7331 4.39296 11.8083 4.64603 11.1785 5.28609L9.41012 7.0536L8.23178 5.87526L10.0001 4.10693C11.6294 2.4919 14.2576 2.49765 15.8797 4.1198C17.5019 5.74195 17.5076 8.37019 15.8926 9.99943L14.1251 11.7669V11.7678Z" fill="#38589C" />
                                    </svg>
                                    Connect
                                </button>
                            </Link>
                            <button onClick={() => setIsModalOpenMarker(true)} className="flex items-center justify-center text-white font-[poppins] rounded-[50px] bg-[#38589C] w-full h-14 py-[13px] px-5 text-[13px] lg:text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clip-path="url(#clip0_693_3555)">
                                        <path d="M15 7H9V1C9 0.447719 8.55228 0 8 0C7.44772 0 7 0.447719 7 1V7H1C0.447719 7 0 7.44772 0 8C0 8.55228 0.447719 9 1 9H7V15C7 15.5523 7.44772 16 8 16C8.55228 16 9 15.5523 9 15V9H15C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_693_3555">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Create New
                            </button>
                            {isModalOpenMarker && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white rounded-[30px] p-10 m-[20px]">
                                        <h1 className="text-[18px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">Create new legacy marker</h1>
                                        <div className="py-10">
                                            <label htmlFor="marker_profile" className="flex justify-center cursor-pointer">
                                                <input
                                                    id="marker_profile"
                                                    type="file"
                                                    accept="image/*"
                                                    name="marker_profile"
                                                    className="hidden"
                                                    onChange={handleFileprofileChange}
                                                />
                                                {selectedprofileFile && (
                                                    <img
                                                        src={URL.createObjectURL(selectedprofileFile)}
                                                        alt="Profile"
                                                        className="h-40 w-40 object-cover rounded-full border border-white-300"
                                                    />
                                                )}
                                                {!selectedprofileFile && (
                                                    <div className="h-40 w-40 border border-white-300 rounded-full flex items-center justify-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-12 h-12"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                            </label>
                                            <div className="w-full">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-gray-700 text-sm font-bold mb-2"
                                                >
                                                    Enter name here
                                                </label>
                                                <input
                                                    type="text"
                                                    id="m_name"
                                                    name="m_name"
                                                    value={mark_name.m_name}
                                                    className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                    placeholder="John Doe"
                                                    onChange={handleMarker_Names}
                                                />
                                                {isnameEmpty && (
                                                    <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter Marker Name.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-[10px]">
                                            <button onClick={handleSaveProfilePhoto} className="flex items-center justify-center text-white font-[poppins] rounded-[50px] bg-[#38589C] w-full h-14 py-[13px] px-5 text-[13px] lg:text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clip-path="url(#clip0_693_3555)">
                                                        <path d="M15 7H9V1C9 0.447719 8.55228 0 8 0C7.44772 0 7 0.447719 7 1V7H1C0.447719 7 0 7.44772 0 8C0 8.55228 0.447719 9 1 9H7V15C7 15.5523 7.44772 16 8 16C8.55228 16 9 15.5523 9 15V9H15C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_693_3555">
                                                            <rect width="16" height="16" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                Create Now
                                            </button>
                                            <button onClick={() => setIsModalOpenMarker(false)} className="flex items-center justify-center text-white font-[poppins] rounded-[50px] bg-[#38589C] w-full h-14 py-[13px] px-5 text-[13px] lg:text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {markerAlertOpen && (
                                <div id="alert-border-1" className="shadow-[0px_0px_15px_0px_#3182ce] fixed top-[20px] right-0 z-50 flex gap-[5px] items-center p-4 mb-4 border-t-4 border-[#3258A8] bg-blue-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <div className="ms-3 text-sm font-medium">
                                        Marker Created Successfully
                                    </div>
                                    <button type="button" onClick={dismiss} className="ms-auto -mx-2.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-1" aria-label="Close">
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {/* Display list of emails */}
                        {Createdmarker && Createdmarker.length > 0 ? (
                            Createdmarker.map((Createdmark, index) => (
                                <div key={Createdmark.m_id} className="flex items-center justify-between border border-gray-300 shadow-md rounded-[30px] p-5">
                                    <div className="flex items-center gap-5">
                                        {markerPrfile ? (
                                            <div className="w-[50px] lg:w-[100px]">
                                                <img
                                                    src={markerPrfile}
                                                    width={100}
                                                    height={100}
                                                    alt="kuch bhi"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[50px] lg:w-[100px] bg-gray-200 flex justify-center items-center rounded-full border border-gray-300">
                                            </div>
                                        )}
                                        <div className="">
                                            <h3 className="text-[22px] lg:text-4xl font-[poppins] leading-normal text-[#4C4448]">
                                                {Createdmark.m_name}
                                            </h3>

                                            <p className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 text-[#888587] font-bold uppercase">
                                                {Createdmark.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                aria-label='Options'
                                                icon={<Iconsvgdark />}
                                                variant='outline'
                                            />
                                            <MenuList>
                                                <Link to="/editmarker">
                                                    <MenuItem icon={<Editicon />}>
                                                        Edit
                                                    </MenuItem>
                                                </Link>
                                                <MenuItem icon={<CartIcon />}>
                                                    Order Plaque
                                                </MenuItem>
                                                <MenuItem icon={<DeleteIcon />}>
                                                    Delete
                                                </MenuItem>
                                                <MenuItem icon={<Shareicon />}>
                                                    Share Ownership
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-[200px]">
                                <p className="text-center text-[gray] font-[poppins] text-lg font-semibold">No items to show please add new.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default withLoadingsppiner(Mainprofile);
