import axios from "axios";
import { useState } from "react";
const Update_pass = () => {

    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false); // State to control the success alert
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false); // State to track if the password is empty

    const handlePasswordChange = async () => {
        console.log("New Password :", newPassword);
        if (!newPassword) {
            setIsPasswordEmpty(true);
            setIsSuccessAlertOpen(false);
            return; // Don't proceed further if password is empty
        }
        try {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (tokenInfo === null) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const email = tokenInfoObject.email;

            // Send a POST request to the backend with the email and new password
            const response = await axios.post('http://localhost:8081/update-pass', {
                email: email,
                newPassword: newPassword
            });
            console.log(response.data); // Log the response data
            // Open the success alert
            setIsSuccessAlertOpen(true);
            
            // alert for clear input error
            setIsPasswordEmpty(false);
            // Clear input field after successful update

            const newPassInput = document.getElementById('new_passw') as HTMLInputElement;
            if (newPassInput) {
                newPassInput.value = '';
            }
        } catch (error) {
            // Handle error
            console.error('Failed to update password:', error);
            alert('Failed to update password. Please try again.');
        }
        setTimeout(() => {
            setIsSuccessAlertOpen(false);
        }, 2000);
    };

    return (
        <>
            {isSuccessAlertOpen && (
                <div id="alert-1" className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium font-poppins">
                        Password Successfully Change!
                    </div>
                    <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" aria-label="Close" onClick={() => setIsSuccessAlertOpen(false)}>
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
            )}
            <h2 className="text-4xl font-[poppins] text-center font-bold leading-normal mb-2 text-[#4C4448] mb-2">Change Password</h2>
            <div className="relative mt-2">
                <input
                    type="password"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New Password"
                    id="new_passw"
                    name="new_passw"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                {isPasswordEmpty && (
                    <p className="text-red-600 mt-3 ms-1 text-sm font-medium font-[poppins]">Please enter a new password.</p>
                )}
            </div>
            <button type="button" onClick={handlePasswordChange} className="rounded-[34px] bg-[#38589C] w-full h-14 mt-[30px] sm:mt-[80px] md:mt-[300px] lg:mt-[30px] xl:mt-[30px] py-[13px] px-5 text-base tracking-[2px] font-[poppins] text-[white] hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Save New Password
            </button>
        </>
    )
}

export default Update_pass;