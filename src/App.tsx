import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-[#1A2238]">
        <Link to="/">
          <nav className="flex justify-center p-4 bg-[#1A2238]">
            <h1 className="text-white text-2xl font-bold">React To Do List</h1>
          </nav>
        </Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
