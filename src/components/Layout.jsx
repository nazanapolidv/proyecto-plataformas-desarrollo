import React from "react";

const Layout = ({ children
    
 }) => {
    return (
        <div classNameName="flex flex-col min-h-screen">
        <header classNameName="bg-gray-800 text-white p-4">
            <h1 classNameName="text-2xl">My Application</h1>
        </header>
        <main classNameName="flex-grow p-4">{children}</main>
        <footer classNameName="bg-gray-800 text-white p-4 text-center">
            &copy; 2023 My Application
        </footer>
        </div>
    );
}