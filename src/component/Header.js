import { googleLogout } from "@react-oauth/google";
import { Button, Dropdown, Menu, message } from "antd";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../component/image/logo.png"
import chplay from "../component/image/chplay.png"
import fire from "../component/image/fire.png"

export default function Header() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const location = useLocation()

  const logout = () => {
    googleLogout();
    removeCookie("user");
    message.success("Đăng xuất thành công!")
    navigate("/login");
  }

  const items = [
    {
      key: '1',
      label: (
        <a href={`/profile/${cookies?.user?.id}`}>
          Profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={()=>logout()}>
          Logout
        </a>
      ),
    },
  ];

  return (
    <nav class="sticky top-0 z-10 bg-white shadow-lg border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="bg-gray-50">
        <div className="max-w-screen-xl flex items-center justify-end mx-auto py-2">
          <img src={fire} className="h-5 pr-2"/>
          <img src={fire} className="h-5 pr-2"/>
          <p className="pr-2 font-bold text-green-700">Download App</p>
          <img src={chplay} className="h-10"/>
        </div>
      </div>
      <div class="max-w-screen-xl flex flex-wrap bg-white items-center justify-between mx-auto p-2">
        <a href="/" class="flex items-center">
          <img src={logo} className="w-10 h-10 rounded-full"/>
          <p className="pl-2 text-black-800 font-bold text-xl">VuaLingo</p>
        </a>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
          onClick={() => setOpenNav(!openNav)}
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div class={`${openNav ? "" : "hidden"} w-full md:block md:w-auto`}>
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 text-black-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="pt-1">
              <Link className={location?.pathname.includes("/topic") ? "block md:p-0 font-bold text-red-700" : "block md:p-0 md:hover:text-black"} to={"/topic"}>
                Topic
              </Link>
            </li>
            <li className="pt-1">
              <Link className={location?.pathname.includes("/blog") ? "block md:p-0 font-bold text-red-700" : "block md:p-0 md:hover:text-black"} to={"/blog"}>
                Blog
              </Link>
            </li>
            <li className="pt-1">
              <Link className={location?.pathname.includes("/playlist") ? "block md:p-0 font-bold text-red-700" : "block md:p-0 md:hover:text-black"} to={"/playlist"}>
                Playlist
              </Link>
            </li>
            <li className="pt-1">
              <Dropdown
                dropdownRender={(menu) => (
                  <div className="bg-white rounded-xl p-4 shadow-xl">
                    <Link className="block text-black font-semibold pb-1" to={"/ranking/streak"}>
                      BXH Streak
                    </Link>
                    <Link className="blocktext-black font-semibold" to={"/ranking/timer"}>
                      BXH Timer
                    </Link>
                  </div>
                )}
                placement="bottom"
                trigger={['click']}
              >
                <Link className={location?.pathname.includes("/ranking") ? "block md:p-0 font-bold text-red-700" : "block md:p-0 md:hover:text-black"}>
                  Ranking
                </Link>
              </Dropdown>
            </li>
            {cookies?.user ?
              <li>
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottom"
                >
                  <img src={cookies?.user?.avatar} className="h-8"/>
                </Dropdown>
              </li>
              : 
              <li className="pt-1">
                <Link className={location?.pathname.includes("/login") ?"block md:p-0 font-bold text-red-700" : "block md:p-0 md:hover:text-black"} to={"/login"}>
                  Login
                </Link>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
