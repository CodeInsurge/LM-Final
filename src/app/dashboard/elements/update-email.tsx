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
import Iconsvgdark from "../../components/icons/icon_dark"
import path from "path";

const UpdateEmail = () => {
    const [isSuccessAlertOpen_altemail, setIsSuccessAlertOpen_altemail] = useState(false); // State to control the success alert
    const [isEmailEmpty, setIsEmailEmpty] = useState(false); // State to track if the Email is empty
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [emails, setEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState<string>('');

    // save_address post query for databse
    const [emailData, setEmailData] = useState({ email: '', alt_email: '' });
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
                const response = await axios.get(`http://localhost:8081/fetch-emails?email=${user_email}`);
                // Update the state with the fetched emails
                setEmails(response.data.alt_email ? [response.data.alt_email] : []);
            } catch (error) {
                console.error('Failed to fetch emails:', error);
            }
        };
        // Call the fetchEmails function when the component mounts
        fetchEmails();
    }, []);

    // Function to handle saving the address
    const saveAddress = async () => {
        if (!emailData.alt_email) {
            // Set corresponding state variables to true if the fields are empty
            setIsEmailEmpty(true);
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
            const response = await axios.post('http://localhost:8081/update-email', {
                ...emailData,
                email: email // Include the email in the request body
            });

            // Handle successful response
            console.log(response.data); // Log the response data
            // Show the success alert
            setIsSuccessAlertOpen_altemail(true);
            setIsEmailEmpty(false);

            // Clear the input fields in the UI
            const altemailInput = document.getElementById('alt_email') as HTMLInputElement;

            if (altemailInput) {
                altemailInput.value = '';
            }
            // Update the emails state with the newly added email
            setEmails((prevEmails: string[]) => [...prevEmails, emailData.alt_email]);
        } catch (error) {
            // Handle error
            console.error('Failed to save address:', error);
        }
        // Set a timeout to change the state back to false after 2 seconds
        setTimeout(() => {
            setIsSuccessAlertOpen_altemail(false);
        }, 2000);
    };

    // Event handler to update address data
    const handleChange = (e: any) => {
        setEmailData({
            ...emailData,
            [e.target.name]: e.target.value
        });
        setNewEmail(e.target.value);
    };

    const deleteEmails = async (index: number) => {
        try {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (!tokenInfo) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const localEmail = tokenInfoObject.email;

            // Send a DELETE request to the backend endpoint to delete the phone number
            const response = await axios.delete(`http://localhost:8081/delete-emails?localEmail=${localEmail}`);

            // Check the response status code
            if (response.status !== 200) {
                throw new Error(`Unexpected response status code: ${response.status}`);
            }

            // Update the UI by removing the phone number from the numbers state array
            setEmails((prevEmails) => {
                const updatedEmails = [...prevEmails];
                updatedEmails.splice(index, 1);
                return updatedEmails;
            });
        } catch (error) {
            console.error('Failed to delete phone number:', error);
        }
    };

    return (
        <>
            <div className="for3 flex justify-between items-center pb-5 mt-12 mb-5 ml-5 border-b border-blueGray-200">
                <div className="">
                    <h4 className="text-lg lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                        Email Address
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
                                {isSuccessAlertOpen_altemail && (
                                    <div id="alert-1" className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                        </svg>
                                        <span className="sr-only">Info</span>
                                        <div className="ms-3 text-sm font-medium">
                                            Email successfully saved!
                                        </div>
                                        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" aria-label="Close">
                                            <span className="sr-only">Close</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <h2 className="text-4xl font-[poppins] text-center font-bold leading-normal mb-2 text-[#4C4448] mb-2">Save New Email Address</h2>
                                <div className="flex flex-col gap-[20px] pt-[40px] px-[20px]">
                                    <div className="">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="alt_email"
                                            name="alt_email"
                                            className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                                            onChange={handleChange}
                                        />
                                        {isEmailEmpty && (
                                            <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a new Email.</p>
                                        )}
                                    </div>
                                </div>
                                <button type="button"
                                    onClick={saveAddress}
                                    className="rounded-[34px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[300px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Save New Email Address
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
            {/* Display list of emails */}
            {emails && emails.length > 0 ? (
                emails.map((email, index) => (
                    <div key={index} className="bg-[#F6F6F6] flex items-center mt-3 relative justify-between p-5 rounded-lg">
                        <div className="flex flex-row items-center">
                            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                                <path d="M6.91406 7.79297L9.61091 9.38745C11.1832 10.317 11.8116 10.317 13.3839 9.38745L16.0807 7.79297" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path xmlns="http://www.w3.org/2000/svg" d="M2.34648 12.3533C2.40641 15.1634 2.43637 16.5684 3.47324 17.6092C4.51011 18.65 5.95317 18.6863 8.83929 18.7588C10.6181 18.8035 12.3793 18.8035 14.1581 18.7588C17.0442 18.6863 18.4873 18.65 19.5242 17.6092C20.561 16.5684 20.591 15.1634 20.6509 12.3533C20.6702 11.4498 20.6702 10.5516 20.6509 9.64801C20.591 6.83794 20.561 5.4329 19.5242 4.39209C18.4873 3.35128 17.0442 3.31502 14.1581 3.24251C12.3793 3.19781 10.6181 3.19781 8.83929 3.2425C5.95317 3.31501 4.51011 3.35126 3.47324 4.39208C2.43637 5.43289 2.40641 6.83793 2.34648 9.648C2.32721 10.5515 2.32721 11.4498 2.34648 12.3533Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <p className="font-[poppins] text-center">{email}</p>
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
                                        onClick={() => deleteEmails(index)}
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
        </>
    )
}

export default UpdateEmail;