import React from "react";
import logo from "../assets/logowhite.png";

export default function Header() {
  return (
    <header className="border-b border-stone-200 bg-teal-700 text-white px-2 sm:px-6">
   
        <div className="flex items-center">
          <img src={logo} alt="" className="h-20 w-22 sm:h-30 sm:w-32" />
          <h1 className="text-[30px] sm:text-[45px]">Damdamin</h1>
        </div>
    </header>
  );
}
