import React, { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UpdateCoverPhoto = () => {
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false); // State to control the cover modal
    const [selectedFileCover, setSelectedFileCover] = useState<File | null>(null);
    const [CoverPhotoUrl, setCoverPhotoUrl] = useState('');

    const handleFileChangeCover = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFileCover(files[0]);
        }
    };

    // Get the email from localStorage
    const tokenInfo = localStorage.getItem('token-info');
    if (tokenInfo === null) {
        throw new Error("Token info not found in local storage.");
    }

    const tokenInfoObject = JSON.parse(tokenInfo);
    const emailcover = tokenInfoObject.email;

    useEffect(() => {
        const fetchCoverPhotoUrl = async () => {
            try {
                // Fetch cover photo as a Blob from the backend
                const response = await axios.get(`http://localhost:8081/cover-photo-url?email=${emailcover}`, {
                    responseType: 'blob',
                });

                // Create an object URL for the Blob and update the state
                setCoverPhotoUrl(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Failed to fetch profile photo URL:", error);
            }
        };

        // Call the fetchCoverPhotoUrl function when the component mounts
        fetchCoverPhotoUrl();
    }, []); // Make sure to pass any dependencies here if needed

    const handleSaveCoverPhoto = async () => {
        if (!selectedFileCover) {
            // Handle case where no file is selected
            return;
        }

        const formData = new FormData();
        formData.append('email', emailcover);
        formData.append('coverphoto', selectedFileCover);

        try {
            // Send a POST request to upload the cover photo
            await axios.post('http://localhost:8081/update-CoverPhoto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update profile photo URL in real-time
            const updatedCoverPhotoResponse = await axios.get(`http://localhost:8081/cover-photo-url?email=${emailcover}`, {
                responseType: 'blob',
            });
            setCoverPhotoUrl(URL.createObjectURL(updatedCoverPhotoResponse.data));

            // Close the cover photo modal
            setIsCoverModalOpen(false);

        } catch (error) {
            // Handle error
            console.error('Failed to upload cover photo:', error);
        }
    };

    return (
        <>
            <div className="relative block h-[300px]">
                <div className="flex flex-col">
                    <div onClick={() => setIsCoverModalOpen(true)} className="cursor-pointer rounded-[10px] p-[10px] flex items-center gap-[10px] text-white font-[poppins] bg-gray-900 backdrop-filter backdrop-blur-sm bg-opacity-40 absolute right-[20px] mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#clip0_812_7960)">
                                <path d="M11.8155 2L10.8735 0.778667C10.6859 0.537204 10.4457 0.341611 10.1713 0.206703C9.89684 0.0717943 9.5953 0.0011087 9.2895 0L6.7135 0C6.4077 0.0011087 6.10616 0.0717943 5.83172 0.206703C5.55728 0.341611 5.31715 0.537204 5.1295 0.778667L4.1875 2H11.8155Z" fill="white" />
                                <path d="M7.99869 12.0003C9.47145 12.0003 10.6654 10.8064 10.6654 9.33365C10.6654 7.8609 9.47145 6.66699 7.99869 6.66699C6.52594 6.66699 5.33203 7.8609 5.33203 9.33365C5.33203 10.8064 6.52594 12.0003 7.99869 12.0003Z" fill="white" />
                                <path d="M12.6667 3.33301H3.33333C2.4496 3.33407 1.60237 3.6856 0.97748 4.31049C0.352588 4.93538 0.00105857 5.78261 0 6.66634L0 12.6663C0.00105857 13.5501 0.352588 14.3973 0.97748 15.0222C1.60237 15.6471 2.4496 15.9986 3.33333 15.9997H12.6667C13.5504 15.9986 14.3976 15.6471 15.0225 15.0222C15.6474 14.3973 15.9989 13.5501 16 12.6663V6.66634C15.9989 5.78261 15.6474 4.93538 15.0225 4.31049C14.3976 3.6856 13.5504 3.33407 12.6667 3.33301ZM8 13.333C7.20887 13.333 6.43552 13.0984 5.77772 12.6589C5.11992 12.2193 4.60723 11.5946 4.30448 10.8637C4.00173 10.1328 3.92252 9.32856 4.07686 8.55264C4.2312 7.77672 4.61216 7.06399 5.17157 6.50458C5.73098 5.94517 6.44372 5.5642 7.21964 5.40986C7.99556 5.25552 8.79983 5.33474 9.53073 5.63749C10.2616 5.94024 10.8864 6.45293 11.3259 7.11072C11.7654 7.76852 12 8.54187 12 9.333C11.9989 10.3935 11.5772 11.4103 10.8273 12.1603C10.0773 12.9102 9.06054 13.3319 8 13.333Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_812_7960">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        Edit cover photo
                    </div>
                    {isCoverModalOpen && (
                        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white rounded-[30px] p-8 m-[20px]">
                                {/* Add modal content here */}
                                <label htmlFor="fileInput" className="cursor-pointer">
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        name="coverphoto"
                                        onChange={handleFileChangeCover} />
                                </label>
                                <div className="flex gap-[20px] mt-[30px]">
                                    <button
                                        onClick={handleSaveCoverPhoto}
                                        className="rounded-[34px] font-[poppins] mt-[10px] w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsCoverModalOpen(false)}
                                        className="rounded-[34px] font-[poppins] mt-[10px]  w-full px-4 py-2 bg-[#38589C] text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {CoverPhotoUrl ? (
                        <img
                            src={CoverPhotoUrl}
                            alt="Cover Photo"
                            className="h-[350px] w-full object-cover border border-gray-300" />
                    ) : (
                        <div className="h-[350px] w-full bg-gray-200 flex justify-center items-center border border-gray-300">
                            <p className="text-center text-[gray] font-[poppins] text-lg font-semibold">No items to show please edit cover.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdateCoverPhoto;