
import './App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom"

import HomeView from './home/home';
import { LoginView } from './login/login';
import PlannerView from './planner/planner';
import DashboardView from './dashboard/dashboard';
import { SignUpView } from './signup/signup';
import { LogoutView } from './logout/logout';

const NoLoginNav = () => (
  <nav id="navbar" className="nologin">
    <Link className={"link-styles"} to="/signup">Sign Up</Link>
    <Link className={"link-styles"} to="/login">Log In</Link>
    <Link className={"link-styles"} to="/">Home</Link>
    <Link className={"link-home"} to="/">São Paulo Adventure</Link>
  </nav>
);

const LoggedInNav = () => (
  <nav id="navbar" className="loggedin">
    <Link className={"link-styles"} to="/logout">Logout</Link>
    <Link className={"link-styles"} to="/planner">Trip Planner</Link>
    <Link className={"link-styles"} to="/dashboard">Dashboard</Link>
    <Link className={"link-home"} to="/">São Paulo Adventure</Link>
  </nav>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router> 
      <div className="main">
      {isLoggedIn ? <LoggedInNav /> : <NoLoginNav />}

        <Routes>
           <Route path="/" element={<HomeView></HomeView>}/>
           <Route path="/login" element={<LoginView handleLogin={handleLogin} />} />
           <Route path="/signup" element={<SignUpView></SignUpView>}/>
           <Route path="/planner" element={<PlannerView></PlannerView>}/>
           <Route path="/dashboard" element={<DashboardView></DashboardView>}/>
           <Route path="/logout" element={<LogoutView handleLogout={handleLogout} />}/>

        </Routes>
     </div>
    </Router>
   );
}

export default App;
