import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from "./Home";

function App() {
    return (
        <div className="App flex justify-center">
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;