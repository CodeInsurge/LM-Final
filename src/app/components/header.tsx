
import { Image, Input } from '@chakra-ui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from "react-router-dom";
// import { faGift } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
// import { HamburgerIcon } from '@chakra-ui/icons'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from '@chakra-ui/react'
// import Question from './icons/Question';
// import Mic from './icons/mic';
// import Play_custom from './icons/Play_custom';
import Hamburger from './icons/hamburger';

const NavBar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token-info') !== null);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem('token-info') !== null);
        };

        window.addEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="bg-white border-gray-200">
            <div className="container flex flex-wrap items-center justify-between py-4 mx-auto lg:py-6 md:px-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <a href="/">
                        <Image src="https://smellmeloveme.shop/wp-content/uploads/2024/01/logo123.png" className="h-8" alt="Legacy Marker" />
                    </a>
                    <form>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 rounded-full border border-[#E6E3E4] rounded-lg placeholder-gray-400" placeholder="Search...." required />
                        </div>
                    </form>
                    <div className="block md:hidden xl:hidden sm:hidden ">
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<Hamburger />}
                                variant='outline'
                            />
                            <MenuList>
                                <Link className="text-[#38589C]" to="/helpandsupport">
                                    <MenuItem
                                        className="font-[poppins] font-medium"
                                    >
                                        Help & Suppot
                                    </MenuItem>
                                </Link>
                                <MenuItem
                                    className="text-[#38589C] font-[poppins] font-medium"
                                >
                                    Affiliate Links
                                </MenuItem>

                                <MenuItem
                                    className="text-[#38589C] font-[poppins] font-medium"
                                >
                                    How to vieos
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                    <Link to="/Gift">
                        <Image width={30} height={30} className="sm:hidden md:hidden lg:hidden xl:hidden " src="https://smellmeloveme.shop/wp-content/uploads/2024/01/Frame-5.png" alt="" />
                    </Link>
                </div>

                <div className="hidden w-full md:block md:w-auto flex flex-col items-center p-4 md:p-0 mt-4" id="navbar-default">
                    <ul className="font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link to="/Gift" className="flex gap-[10px] items-center text-[22px] mymenu py-2 px-3 text-black bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 6V19M10 6C10 6 10 4.50722 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C11.4027 6 10 6 10 6ZM10 6C10 6 10 4.06291 10 3.5C10 2.11929 8.88071 1 7.5 1C6.11929 1 5 2.11929 5 3.5C5 4.88071 6.11929 6 7.5 6C8.3178 6 10 6 10 6ZM3 10H17M3 10C1.89543 10 1 9.10457 1 8C1 6.89543 1.89543 6 3 6H17C18.1046 6 19 6.89543 19 8C19 9.10457 18.1046 10 17 10M3 10L3 17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V10" stroke="#38589C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                Gift
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="block py-2 font-bold mymenu px-3 text-black-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 hover:text-blue-700">Login</Link>
                        </li>
                        <li>
                            <Link to={isLoggedIn ? '/mainprofile' : '/register'}>
                                <button type="button" className="rounded-[34px] bg-[#38589C] py-[13px] px-5 text-base font-[poppins] text-[white]">
                                    {isLoggedIn ? 'My Account' : 'Create Account'}
                                </button>
                            </Link>
                        </li>
                        <li>
                            <div className="hs-dropdown relative inline-flex">
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label='Options'
                                        icon={<Hamburger />}
                                        variant='outline'
                                    />
                                    <MenuList>
                                        <Link className="text-[#38589C]" to="/helpandsupport">
                                            <MenuItem
                                                className="font-[poppins] font-medium"
                                            >
                                                Help & Suppot
                                            </MenuItem>
                                        </Link>
                                        <MenuItem
                                            className="text-[#38589C] font-[poppins] font-medium"
                                        >
                                            Affiliate Links
                                        </MenuItem>
                                        <MenuItem
                                            className="text-[#38589C] font-[poppins] font-medium"
                                        >
                                            How to vieos
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default NavBar;
