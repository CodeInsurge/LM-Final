"use client"
import React, { ChangeEvent, useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Iconsvgdark from "../components/icons/icon_dark"
import axios from "axios";
import withLoadingsppiner from '../loader/customhook';
import Update_pass from "./elements/update-pass";
import Updatephone from "./elements/update-phone";
import UpdateEmail from "./elements/update-email";
import Updatenames from "./elements/update-names";
import UpdateProfilePhoto from "./elements/ChangeProfile";
import UpdateCoverPhoto from "./elements/update-CoverPhoto";
import DeleteIcon from "../components/icons/delete";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from '@chakra-ui/react'
// import Update_pass from '../dashboard/elements/update-pass';

const Profile = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false); // State to control the success alert
    const [isStreetEmpty, setIsStreetEmpty] = useState(false); // State to track if the Street is empty
    const [isStateEmpty, setIsStateEmpty] = useState(false); // State to track if the State is empty
    const [isCityEmpty, setIsCityEmpty] = useState(false); // State to track if the City is empty
    const [isApartmentEmpty, setIsApartmentEmpty] = useState(false); // State to track if the Apartment is empty
    const [isZipEmpty, setIsZipEmpty] = useState(false); // State to track if the Zip is empty

    const [fetchaddress, setfetchaddress] = useState<{ email: string; s_address: string; apartment: string; city: string; state: string; zip_code: string; }[]>([]);
    const [newfetchaddress, setNewfetchaddress] = useState<string>('');

    // save_address post query for databse
    const [addressData, setAddressData] = useState({ email: '', s_address: '', apartment: '', city: '', state: '', zip_code: '' });

    useEffect(() => {
        const fetchEmails = async () => {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (tokenInfo === null) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const email = tokenInfoObject.email;
            const user_email = email; // email of the user
            try {
                // Send a GET request to fetch the emails from the backend
                const response = await axios.get(`http://localhost:8081/fetch-addressData?email=${user_email}`);
                // Update the state with the fetched emails
                setfetchaddress(response.data ? [response.data] : []);
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch emails:', error);
            }
        };
        // Call the fetchEmails function when the component mounts
        fetchEmails();
    }, []);
    // Function to handle saving the address
    const saveAddress = async () => {
        if (!addressData.s_address && !addressData.apartment && !addressData.city && !addressData.state && !addressData.zip_code) {
            // Set corresponding state variables to true if the fields are empty
            setIsStreetEmpty(true);
            setIsApartmentEmpty(true);
            setIsCityEmpty(true);
            setIsStateEmpty(true);
            setIsZipEmpty(true);
            return; // Stop further execution if any field is empty
        }
        // Get the email from localStorage
        const tokenInfo = localStorage.getItem('token-info');
        if (tokenInfo === null) {
            throw new Error("Token info not found in local storage.");
        }
        const tokenInfoObject = JSON.parse(tokenInfo);
        const email = tokenInfoObject.email;

        try {
            // Send a POST request to the backend endpoint to save the address
            const response = await axios.post('http://localhost:8081/profile', {
                ...addressData,
                email: email // Include the email in the request body
            });
            console.log(response.data);

            // Update the addressData state with the newly added addressData
            setfetchaddress((prevAddress) => [...prevAddress, addressData]);

            // Show the success alert
            setIsSuccessAlertOpen(true);
            setIsStreetEmpty(false);
            setIsApartmentEmpty(false);
            setIsCityEmpty(false);
            setIsStateEmpty(false);
            setIsZipEmpty(false);

            // Clear the input fields in the UI
            const streetAddressInput = document.getElementById('s_address') as HTMLInputElement;
            const apartmentInput = document.getElementById('apartment') as HTMLInputElement;
            const cityInput = document.getElementById('city') as HTMLInputElement;
            const stateInput = document.getElementById('state') as HTMLInputElement;
            const zipCodeInput = document.getElementById('zip_code') as HTMLInputElement;

            if (streetAddressInput && apartmentInput && cityInput && stateInput && zipCodeInput) {
                streetAddressInput.value = '';
                apartmentInput.value = '';
                cityInput.value = '';
                stateInput.value = '';
                zipCodeInput.value = '';
            }

        } catch (error) {
            // Handle error
            console.error('Failed to save address:', error);
        }
        // Set a timeout to change the state back to false after 2 seconds
        setTimeout(() => {
            setIsSuccessAlertOpen(false);
        }, 2000);
    };
    // Event handler to update address data
    const handleChange = (e: any) => {
        setAddressData({
            ...addressData,
            [e.target.name]: e.target.value
        });
        setNewfetchaddress(e.target.value);

    };

    const deleteAddress = async (index: number) => {
        try {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (!tokenInfo) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const localEmail = tokenInfoObject.email;

            // Send a DELETE request to the backend endpoint to delete the phone number
            const response = await axios.delete(`http://localhost:8081/delete-address?localEmail=${localEmail}`);

            // Check the response status code
            if (response.status !== 200) {
                throw new Error(`Unexpected response status code: ${response.status}`);
            }

            // Update the UI by removing the phone number from the numbers state array
            setfetchaddress((prevAddress) => {
                const updatedAddress = [...prevAddress];
                updatedAddress.splice(index, 1);
                return updatedAddress;
            });
        } catch (error) {
            console.error('Failed to delete Address:', error);
        }
    };

    return (
        <>
            <div className="profile-page">
                <UpdateCoverPhoto />
                <UpdateProfilePhoto />
                <div className="w-full lg:w-[70%] md:w-full container mx-auto border border-gray-300 shadow-md rounded-[30px] p-[20px] lg:p-[50px] md:p-[50px] mb-[50px]">
                    <Tabs>
                        <TabList className="profiletabmain">
                            <Tab>Profile</Tab>
                            <Tab>Orders</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Tabs>
                                    <div className="lg:flex">
                                        <div className="w-[100%] lg:w-[30%] border-r border-gray-300">
                                            <h1 className="text-[25px] lg:text-[24px] font-[poppins] font-bold leading-normal border-b border-gray-300 pb-2 mb-2 text-[#4C4448]">
                                                Profile
                                            </h1>
                                            <TabList className="profiletabchild block">
                                                <Tab className="profiletab332">Name</Tab>
                                                <Tab className="profiletab332">Address</Tab>
                                                <Tab className="profiletab332">Phone&nbsp;Number</Tab>
                                                <Tab className="profiletab332">Email&nbsp;Address</Tab>
                                                <Tab className="profiletab332">Password</Tab>
                                            </TabList>
                                        </div>
                                        <div className="lg:w-[70%] w-[100%] flex justify-center">
                                            <TabPanels>
                                                <TabPanel>
                                                    {/* Name and lastname tab */}
                                                    <Updatenames />
                                                </TabPanel>
                                                <TabPanel>
                                                    {/* Address Tab */}
                                                    <div className="for1 flex justify-between items-center pb-5 mt-12 mb-5 ml-5 border-b border-blueGray-200">
                                                        <div>
                                                            <h4 className="text-[18px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                                                                Addresses
                                                            </h4>
                                                        </div>
                                                        <div className="btn">
                                                            <button
                                                                onClick={() => setIsModalOpen(true)}
                                                                className="flex items-center justify-center px-4 py-2 bg-[#38589C] text-[14px] text-white rounded-md hover:opacity-75 shadow-md hover:bg-[#38589C] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                                                                    <g clipPath="url(#clip0_725_1868)">
                                                                        <path d="M12.5765 1.33398V3.15217H14.5083V4.36429H12.5765V6.18247H11.2886V4.36429H9.35677V3.15217H11.2886V1.33398H12.5765ZM7.42495 8.60671C6.71662 8.60671 6.13707 8.06126 6.13707 7.39459C6.13707 6.72792 6.71662 6.18247 7.42495 6.18247C8.13329 6.18247 8.71283 6.72792 8.71283 7.39459C8.71283 8.06126 8.13329 8.60671 7.42495 8.60671ZM8.06889 2.58247V3.80671C7.85588 3.77503 7.6406 3.75882 7.42495 3.75823C5.26776 3.75823 3.56132 5.3158 3.56132 7.5158C3.56132 8.93398 4.817 10.8128 7.42495 13.0552C10.0329 10.8128 11.2886 8.94004 11.2886 7.5158V7.39459H12.5765V7.5158C12.5765 9.52792 10.8572 11.9097 7.42495 14.6673C3.99276 11.9097 2.27344 9.52792 2.27344 7.5158C2.27344 4.49762 4.72041 2.54611 7.42495 2.54611C7.64389 2.54611 7.85639 2.55823 8.06889 2.58247Z" fill="white" />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_725_1868">
                                                                            <rect width="17" height="16" fill="white" transform="translate(0.148438)" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                Add new
                                                            </button>
                                                        </div>
                                                        {/* Popup Modal */}
                                                        {isModalOpen && (
                                                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                                                <div className="bg-white rounded-[30px] p-8 m-[20px]">
                                                                    {/* Success Alert */}
                                                                    {isSuccessAlertOpen && (
                                                                        <div id="alert-1" className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                                                            </svg>
                                                                            <span className="sr-only">Info</span>
                                                                            <div className="ms-3 text-sm font-medium">
                                                                                Address successfully saved!
                                                                            </div>
                                                                            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" aria-label="Close" onClick={() => setIsSuccessAlertOpen(false)}>
                                                                                <span className="sr-only">Close</span>
                                                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <h2 className="text-4xl font-[poppins] text-center font-bold leading-normal mb-2 text-[#4C4448] mb-2">New Address</h2>
                                                                    {/* Add modal content here */}
                                                                    <div className="flex flex-col gap-[20px] pt-[40px] px-[20px]">
                                                                        <div className="">
                                                                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Street Address</label>
                                                                            <input
                                                                                type="text"
                                                                                id="s_address"
                                                                                name="s_address"
                                                                                className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isStreetEmpty && (
                                                                                <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a Street Address.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-[20px] pt-[20px] lg:px-[20px]">
                                                                        <div className="">
                                                                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Apartment</label>
                                                                            <input
                                                                                type="text"
                                                                                id="apartment"
                                                                                name="apartment"
                                                                                className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isApartmentEmpty && (
                                                                                <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a Apartment.</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="">
                                                                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">City</label>
                                                                            <input
                                                                                type="text"
                                                                                id="city"
                                                                                name="city"
                                                                                className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isCityEmpty && (
                                                                                <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a City.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-[20px] pt-[20px] lg:px-[20px]">
                                                                        <div className="">
                                                                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">State</label>
                                                                            <input
                                                                                type="text"
                                                                                id="state"
                                                                                name="state"
                                                                                className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isStateEmpty && (
                                                                                <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a State.</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="">
                                                                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                                                                            <input
                                                                                type="text"
                                                                                id="zip_code"
                                                                                name="zip_code"
                                                                                className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isZipEmpty && (
                                                                                <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a Zip Code.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <button type="button"
                                                                        onClick={saveAddress}
                                                                        className="rounded-[34px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[300px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                                        Save New Address
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setIsModalOpen(false)}
                                                                        className="rounded-[34px] font-[poppins] mt-[10px]  w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Display list of address */}
                                                    {fetchaddress?.length > 0 ? (
                                                        fetchaddress.map((address, index) => (
                                                            <div key={index} className="relative bg-[#F6F6F6] flex mt-[20px] items-center justify-between p-5 rounded-lg">
                                                                <div className="flex flex-row items-center">
                                                                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 22 22" fill="none">
                                                                        <path d="M14.6667 9.6263C14.6667 11.3982 13.2302 12.8346 11.4583 12.8346C9.68642 12.8346 8.25 11.3982 8.25 9.6263C8.25 7.85439 9.68642 6.41797 11.4583 6.41797C13.2302 6.41797 14.6667 7.85439 14.6667 9.6263Z" stroke="black" stroke-width="2" />
                                                                        <path d="M11.4577 1.83398C15.6743 1.83398 19.2493 5.53088 19.2493 10.0159C19.2493 14.5724 15.6161 17.77 12.2602 19.9443C12.0157 20.0905 11.7391 20.1673 11.4577 20.1673C11.1763 20.1673 10.8997 20.0905 10.6551 19.9443C7.3055 17.7487 3.66602 14.5882 3.66602 10.0159C3.66602 5.53088 7.24104 1.83398 11.4577 1.83398Z" stroke="black" stroke-width="2" />
                                                                    </svg>
                                                                    <p className="font-[poppins]text-center">{address.s_address} {address.apartment} {address.city} {address.state} {address.zip_code}</p>
                                                                </div>
                                                                <div className="hs-dropdown relative inline-flex">
                                                                    <Menu>
                                                                        <MenuButton
                                                                            as={IconButton}
                                                                            aria-label='Options'
                                                                            icon={<Iconsvgdark />}
                                                                            variant='outline'
                                                                        />
                                                                        <MenuList>
                                                                            <MenuItem
                                                                                className="font-[poppins] font-medium"
                                                                                icon={<DeleteIcon />}
                                                                                onClick={() => { deleteAddress(index) }}
                                                                            >
                                                                                Delete
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
                                                </TabPanel>
                                                <TabPanel>
                                                    {/* Phone number Tab */}
                                                    <Updatephone />
                                                </TabPanel>
                                                <TabPanel>
                                                    {/* Email Addresses Tab */}
                                                    <UpdateEmail />
                                                </TabPanel>
                                                <TabPanel>
                                                    <div className="for4 flex justify-between items-center pb-5 mt-12 mb-5 ml-5 border-b border-blueGray-200">
                                                        {/* Password Tab */}
                                                        <div className="">
                                                            <h4 className="text-lg lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                                                                Password
                                                            </h4>
                                                        </div>
                                                        <div className="btn">
                                                            <button
                                                                onClick={() => setIsModalOpen(true)}
                                                                className="flex items-center justify-center px-4 py-2 bg-[#38589C] text-[14px] text-white rounded-md hover:opacity-75 shadow-md hover:bg-[#38589C] focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                                Change Password
                                                            </button>
                                                            {isModalOpen && (
                                                                <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                                                    <div className="bg-white rounded-[30px] p-8 m-[20px]">
                                                                        {/* Add modal content here */}
                                                                        <Update_pass />
                                                                        <button
                                                                            onClick={() => setIsModalOpen(false)}
                                                                            className="rounded-[34px] font-[poppins] mt-[10px]  w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="p-5 my-5">
                                                        <input
                                                            type="text"
                                                            id="pass"
                                                            name="pass"
                                                            placeholder='XXXXXXXXXXXX'
                                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                                        />
                                                    </div>
                                                </TabPanel>
                                            </TabPanels>
                                        </div>
                                    </div>
                                </Tabs>
                            </TabPanel>
                            <TabPanel>
                                <table className="container table text-center">
                                    <thead>
                                        <tr className="bg-[#F6F6F6]">
                                            <th className="font-[poppins] border px-4 py-2">Orders</th>
                                            <th className="font-[poppins] border px-4 py-2">ID</th>
                                            <th className="font-[poppins] border px-4 py-2">Date</th>
                                            <th className="font-[poppins] border px-4 py-2">Total</th>
                                            <th className="font-[poppins] border px-4 py-2">Tracking code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Gift Card</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Plaque</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Gift Card</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Plaque</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Gift Card</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>
                                        <tr>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">LegacyMraker Plaque</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">#5089</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">31 March 2023</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">$108.90</td>
                                            <td className="font-[poppins] text-[#38589C] border px-4 py-2">9400788789</td>
                                        </tr>

                                    </tbody>
                                </table>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div >

        </>
    );
};

export default withLoadingsppiner(Profile);
