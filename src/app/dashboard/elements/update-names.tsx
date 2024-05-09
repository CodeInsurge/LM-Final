import { useState } from "react";
import axios from "axios";
const Updatenames = () => {
    const [isSuccessAlertOpen_name, setIsSuccessAlertOpen_name] = useState(false); // State to control the success alert
    const [isnameEmpty, setIsNameEmpty] = useState(false); // State to track if the Phone is empty

    // save_address post query for databse
    const [NameData, setNameData] = useState({
        email: '',
        name_f_name: '',
        name_l_name: '',
    });


    // Function to handle saving the address
    const saveNames = async () => {
        if (!NameData.name_f_name && !NameData.name_l_name) {
            // Set corresponding state variables to true if the fields are empty
            setIsNameEmpty(true);
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
            // Send a POST request to the backend endpoint to save the names
            const response = await axios.post('http://localhost:8081/update-names', {
                ...NameData,
                email: email // Include the email in the request body
            });
            // Handle successful response
            console.log(response.data); // Log the response data
            // Show the success alert
            setIsSuccessAlertOpen_name(true);
            setIsNameEmpty(false);
            // Clear the input fields in the UI
            setNameData({
                ...NameData,
                name_f_name: '',
                name_l_name: '',
            });
        } catch (error) {
            // Handle error
            console.error('Failed to save names:', error);
        }
        // Set a timeout to change the state back to false after 2 seconds
        setTimeout(() => {
            setIsSuccessAlertOpen_name(false);
        }, 2000);
    };

    // Event handler to update name data
    const handleChange_Names = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameData({
            ...NameData,
            [e.target.name]: e.target.value
        });
    };
    return (
        <>
            {/* Success Alert */}
            {
                isSuccessAlertOpen_name && (
                    <div id="alert-1" className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div className="ms-3 text-sm font-medium">
                            Names Updated Successfully!
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
            <div className="flex flex-col gap-[20px] pt-[40px] px-[20px]">
                <div className="">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                    <input
                        type="text"
                        id="update_f_name"
                        name="name_f_name"
                        value={NameData.name_f_name}
                        className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                        onChange={handleChange_Names}
                    />
                    {isnameEmpty && (
                        <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter First Name.</p>
                    )}
                </div>
                <div className="">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                    <input
                        type="text"
                        id="update_l_name"
                        name="name_l_name"
                        value={NameData.name_l_name}
                        className="w-full border border-gray-300 rounded-[10px] p-3 font-[poppins]"
                        onChange={handleChange_Names}
                    />
                    {isnameEmpty && (
                        <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter Last Name.</p>
                    )}
                </div>
                <button type="button" onClick={saveNames} className="rounded-[34px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[300px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Save changes
                </button>
            </div>
        </>
    )
}

export default Updatenames;

