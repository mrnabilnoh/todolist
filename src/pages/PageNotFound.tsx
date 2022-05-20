import React from 'react'
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-green-500 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-5">
        <Link to="/">
          <button type="button" className="relative inline-block text-sm font-medium text-[#48bb78] group active:text-green-500 focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-green-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>

            <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
              Go Home
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound