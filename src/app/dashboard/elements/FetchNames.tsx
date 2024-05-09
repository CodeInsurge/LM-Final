import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchingNamesFL = () => {
    interface UserValues {
        f_name: string;
        l_name: string;
        u_name: string;
    }
    const [userData, setUserData] = useState<UserValues | null>();

    useEffect(() => {

        const fetchUserData = async () => {
            // Get the email from localStorage
            const tokenInfo = localStorage.getItem('token-info');
            if (tokenInfo === null) {
                throw new Error("Token info not found in local storage.");
            }
            const tokenInfoObject = JSON.parse(tokenInfo);
            const email = tokenInfoObject.email;
            const user_email = email; // email of the user
            try {
                const response = await axios.get(`http://localhost:8081/FetchNames?email=${user_email}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="">
            {userData ? (
                <h3 className="text-[25px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                    {userData?.f_name} {userData?.l_name}
                </h3>
            ) : (
                <h3 className="text-[25px] lg:text-4xl font-[poppins] font-bold leading-normal mb-2 text-[#4C4448] mb-2">
                    ...Loading
                </h3>
            )}
            {userData ? (
                <p className="text-center lg:text-left text-sm leading-normal mt-0 mb-2 text-blueGray-400 text-[#888587] font-bold uppercase">
                    {userData?.u_name}
                </p>
            ) : (
                <p className="text-center lg:text-left text-sm leading-normal mt-0 mb-2 text-blueGray-400 text-[#888587] font-bold uppercase">
                    ...Loading
                </p>
            )}
        </div>
    );
};

export default FetchingNamesFL;
