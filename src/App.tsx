import type { Component } from "solid-js";
import { Router, Routes, Route } from "solid-app-router";

import { Header } from "./Header";
import { Home } from "./home";
import { MediaBar } from "./mediaBar";
import { MediaProvider } from "./mediaContext";
import { Episodes } from "./episodes";

const App: Component = () => {
  return (
    <Router>
      <MediaProvider>
        <Header />
        <Routes>
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/" element={<Home />} />
          <Route path="/*all" element={<div>Page Not Found</div>} />
        </Routes>
        <MediaBar />
      </MediaProvider>
    </Router>
  );
};

export default App;
