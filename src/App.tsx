import type { Component } from "solid-js";
import { Router, Routes, Route } from "solid-app-router";

import { Header } from "./Header";
import { Home } from "./home";
import { MediaProvider, MediaControls } from "./media";
import { SubscriptionsProvider } from "./subscriptions";
import { Episodes } from "./episodes";

const App: Component = () => {
  return (
    <Router>
      <SubscriptionsProvider>
        <MediaProvider>
          <Header />
          <Routes>
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/" element={<Home />} />
            <Route path="/*all" element={<div>Page Not Found</div>} />
          </Routes>
          <MediaControls />
        </MediaProvider>
      </SubscriptionsProvider>
    </Router>
  );
};

export default App;
