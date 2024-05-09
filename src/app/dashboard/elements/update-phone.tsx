import { useState, useEffect } from "react";
import axios from "axios";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from '@chakra-ui/react'
import DeleteIcon from "../../components/icons/delete";
import Iconsvg from "../../components/icons/icon_light";
import Iconsvgdark from "../../components/icons/icon_dark"

const Updatephone = () => {
    const [isSuccessAlertOpen_phone, setIsSuccessAlertOpen_phone] = useState(false); // State to control the success alert
    const [isPhoneEmpty, setIsPhoneEmpty] = useState(false); // State to track if the Phone is empty
    const [isModalOpen, setIsModalOpen] = useState(false)

    // save_address post query for databse
    const [numberData, setNumberData] = useState({ email: '', phone_number: '' });

    const [numbers, setnumbers] = useState<string[]>([]);
    const [newNumbers, setNewNumbers] = useState<string>('');

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
                const response = await axios.get(`http://localhost:8081/fetch-numbers?email=${user_email}`);
                // Update the state with the fetched emails
                setnumbers(response.data.phone_number ? [response.data.phone_number] : []);
            } catch (error) {
                console.error('Failed to fetch emails:', error);
            }
        };
        // Call the fetchEmails function when the component mounts
        fetchEmails();
    }, []);


    // Function to handle saving the address
    const savePhone = async () => {
        if (!numberData.phone_number) {
            // Set corresponding state variables to true if the fields are empty
            setIsPhoneEmpty(true);
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
            const response = await axios.post('http://localhost:8081/update-phone', {
                ...numberData,
                email: email // Include the email in the request body
            });
            // Handle successful response
            console.log(response.data); // Log the response data
            // Show the success alert
            setIsSuccessAlertOpen_phone(true);
            setIsPhoneEmpty(false);
            // Clear the input fields in the UI
            const phoneNumberInput = document.getElementById('phone_number') as HTMLInputElement;

            if (phoneNumberInput) {
                phoneNumberInput.value = '';
            }

            setnumbers((prevNumbers: string[]) => [...prevNumbers, numberData.phone_number]);
        } catch (error) {
            // Handle error
            console.error('Failed to save address:', error);
        }
        // Set a timeout to change the state back to false after 2 seconds
        setTimeout(() => {
            setIsSuccessAlertOpen_phone(false);
        }, 2000);
    };
    // Event handler to update address data
    const handleChange_Phone = (e: any) => {
        setNumberData({
            ...numberData,
            [e.target.name]: e.target.value
        });
        setNewNumbers(e.target.value);
    };

    const deletePhoneNumber = async (index: number) => {
        try {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (!tokenInfo) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const localEmail = tokenInfoObject.email;

            // Send a DELETE request to the backend endpoint to delete the phone number
            const response = await axios.delete(`http://localhost:8081/delete-number?localEmail=${localEmail}`);

            // Check the response status code
            if (response.status !== 200) {
                throw new Error(`Unexpected response status code: ${response.status}`);
            }

            // Update the UI by removing the phone number from the numbers state array
            setnumbers((prevNumbers) => {
                const updatedNumbers = [...prevNumbers];
                updatedNumbers.splice(index, 1);
                return updatedNumbers;
            });
        } catch (error) {
            console.error('Failed to delete phone number:', error);
        }
    };

    return (
        <>
            <div className="for2 flex justify-between items-center pb-5 mt-12 mb-5 ml-5 border-b border-blueGray-200">
                <div className="">
                    <h4 className="text-lg lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                        Phone Numbers
                    </h4>
                </div>
                <div className="btn">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-[#38589C] text-[14px] text-white rounded-md hover:opacity-75 shadow-md hover:bg-[#38589C] focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M11.25 5.25H6.75V0.75C6.75 0.335789 6.41421 0 6 0C5.58579 0 5.25 0.335789 5.25 0.75V5.25H0.75C0.335789 5.25 0 5.58579 0 6C0 6.41421 0.335789 6.75 0.75 6.75H5.25V11.25C5.25 11.6642 5.58579 12 6 12C6.41421 12 6.75 11.6642 6.75 11.25V6.75H11.25C11.6642 6.75 12 6.41421 12 6C12 5.58579 11.6642 5.25 11.25 5.25Z" fill="white" />
                        </svg>
                        Add new
                    </button>
                    {isModalOpen && (
                        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white rounded-[30px] p-8 m-[20px]">
                                {/* Add modal content here */}
                                {/* Success Alert */}
                                {
                                    isSuccessAlertOpen_phone && (
                                        <div id="alert-1" className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <span className="sr-only">Info</span>
                                            <div className="ms-3 text-sm font-medium">
                                                Phone successfully saved!
                                            </div>
                                            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" aria-label="Close">
                                                <span className="sr-only">Close</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                }
                                <h2 className="text-4xl font-[poppins] text-center font-bold leading-normal mb-2 text-[#4C4448] mb-2">Save New Phone Number</h2>
                                <div className="flex flex-col gap-[20px] pt-[40px] px-[20px]">
                                    <div className="">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                            onChange={handleChange_Phone}
                                        />
                                        {isPhoneEmpty && (
                                            <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a new Phone Number.</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={savePhone}
                                    type="button" className="rounded-[34px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[300px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Save New Phone Number
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
            </div>
            {numbers && numbers.length > 0 ? (
                numbers.map((number, index) => (
                    <div key={index} className="bg-[#F6F6F6] flex p-5 my-5 relative items-center justify-between p-5 rounded-lg">
                        <div className="flex flex-row items-center">
                            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                <path d="M17.75 15.4167V13.9079C17.75 13.1582 17.2936 12.4841 16.5975 12.2057L14.7329 11.4598C13.8476 11.1057 12.8387 11.4893 12.4123 12.3422L12.25 12.6667C12.25 12.6667 9.95833 12.2083 8.125 10.375C6.29167 8.54167 5.83333 6.25 5.83333 6.25L6.15785 6.08774C7.01068 5.66133 7.39428 4.65238 7.04016 3.76708L6.29431 1.90245C6.0159 1.20641 5.34176 0.75 4.59211 0.75H3.08333C2.07081 0.75 1.25 1.57081 1.25 2.58333C1.25 10.6835 7.81649 17.25 15.9167 17.25C16.9292 17.25 17.75 16.4292 17.75 15.4167Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                            <p className="font-[poppins]text-center">{number}</p>
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
                                        onClick={() => deletePhoneNumber(index)}
                                    >{/* Call deletePhoneNumber function with index */}
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

        </>
    )
}

export default Updatephone;