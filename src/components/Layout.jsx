import React from "react";

const Layout = ({ children
    
 }) => {
    return (
        <div className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl">My Application</h1>
        </header>
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
            &copy; 2023 My Application
        </footer>
        </div>
    );
}