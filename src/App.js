import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import News from "./Components/News";
import LoadingBar from "react-top-loading-bar";

const AppContent = () => {
  const pageSize = 15;
  const apiKey = process.env.REACT_APP_API_KEY;

  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation(); //current page's URL path

  // Reset searchQuery  to an empty string when navigating to a new route
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <>
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      <LoadingBar color="#f11946" progress={progress} height={3} />
      <Routes>
        {[
          { path: "/", category: "general", label: "Home" },
          { path: "/business", category: "business" },
          { path: "/entertainment", category: "entertainment" },
          { path: "/general", category: "general" },
          { path: "/health", category: "health" },
          { path: "/science", category: "science" },
          { path: "/sports", category: "sports" },
          { path: "/technology", category: "technology" },
        ].map(({ path, category, label }) => (
          <Route
            key={category}
            exact
            path={path}
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key={category}
                pageSize={pageSize}
                country="us"
                category={category}
                label={label}
                searchQuery={searchQuery}
              />
            }
          />
        ))}
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
