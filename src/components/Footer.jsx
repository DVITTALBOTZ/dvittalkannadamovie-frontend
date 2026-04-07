import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {

  const TG_URL = import.meta.env.VITE_TG_URL;
  const SITENAME = import.meta.env.VITE_SITENAME;

  const location = useLocation();

  return (
    <section className="relative pt-10 border-t-2 border-btnColor xxl:container m-auto">

      {/* TOP FOOTER */}
      <div className="flex flex-col items-start justify-between w-11/12 gap-6 m-auto md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/3 lg:p-6">

          {/* LOGO */}
          <div className="flex items-center text-secondaryTextColor uppercase gap-4 mb-4 font-bold text-2xl">
            <a href="/" className="-space-y-1">
              <p className="text-2xl text-otherColor">{SITENAME}</p>
            </a>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-secondaryTextColor lg:text-md">
            This site does not store any file on the server, it only links
            to media files which are hosted on Telegram.
          </p>

          {/* TELEGRAM BUTTON */}
          <div className="mt-6">
            <a
              href={TG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-fit px-5 py-3 bg-[#0088cc] hover:bg-[#0a7abf] text-white rounded-lg shadow-md transition-all duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 24c6.629 0 12-5.371 12-12S18.629 0 12 0 0 5.371 0 12s5.371 12 12 12zM5.491 11.74l11.57-4.461c.537-.194 1.006.131.832.943l-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z"
                  fill="white"
                />
              </svg>

              <span className="font-semibold">
                Join Update Channel
              </span>
            </a>
          </div>

        </div>

        {/* RIGHT */}
        <div className="w-full text-primaryTextColor md:w-1/3 lg:p-6">

          <button className="border-b-2 border-otherColor text-xl cursor-default mb-5 md:text-2xl">
            Quick Menu
          </button>

          <ul className="capitalize text-secondaryTextColor flex flex-col space-y-4 text-sm lg:text-md">

            <Link
              to="/"
              className="transition-all duration-300 hover:text-primaryTextColor"
            >
              <li>Home</li>
            </Link>

            <Link
              to="/movies"
              className="transition-all duration-300 hover:text-primaryTextColor"
            >
              <li>Movies</li>
            </Link>

            <Link
              to="/series"
              className="transition-all duration-300 hover:text-primaryTextColor"
            >
              <li>Series</li>
            </Link>

          </ul>

        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t-2 border-btnColor py-6 mt-5">

        <div className="flex flex-col gap-5 items-center justify-center w-11/12 m-auto sm:flex-row">

          <div className="flex items-center gap-2 text-sm text-secondaryTextColor">

            <span className="flex items-center justify-center w-5 h-5 border-2 border-secondaryTextColor rounded-full text-xs">
              C
            </span>

            <p className="uppercase">
              {SITENAME}. All Rights Reserved
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
