import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [openNav, setOpenNav] = React.useState(false);
  const [show1, setShow1] = useState(false);

  return (
    <nav class="sticky top-0 z-10 bg-sky-800 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center">
          {/* <img src={logo} class="h-8 mr-3" alt="Flowbite Logo" /> */}
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Listen English
          </span>
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
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 text-white md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link className="block py-2 pl-3 pr-4 md:p-0 md:hover:text-black" to={"/"}>
                Topic
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 pl-3 pr-4 md:p-0 md:hover:text-black"
                to={"so-xo-mien-nam"}
              >
                Bảng xếp hạng
              </Link>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                onClick={() => {
                  setShow1(!show1);
                }}
                class="flex items-center justify-between w-full py-2 pl-3 pr-4 text-white rounded hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-black md:p-0 md:w-auto dark:text-white md:dark:hover:text-orange-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Trang cá nhân
                <svg
                  class="w-2.5 h-2.5 ml-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                class={`${
                  show1 ? "absolute" : "hidden"
                } z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
              >
                <ul
                  class="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      onClick={() => {
                        setShow1(!show1);
                        setOpenNav(false);
                      }}
                      to="so-xo-mien-bac-30-ngay"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Kết quả miền bắc 30 ngày
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        setShow1(!show1);
                        setOpenNav(false);
                      }}
                      to="so-xo-mien-nam-30-ngay"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Kết quả miền nam 30 ngày
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        setShow1(!show1);
                        setOpenNav(false);
                      }}
                      to="so-xo-mien-trung-30-ngay"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Kết quả miền trung 30 ngày
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
