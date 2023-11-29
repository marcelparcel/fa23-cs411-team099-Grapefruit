
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
import AccountView from './account/account';

const NoLoginNav = () => (
  <nav id="navbar" className="nologin">
    <Link className={"link-styles"} to="/signup">Sign Up</Link>
    <Link className={"link-styles"} to="/login">Log In</Link>
    <Link className={"link-home"} to="/">São Paulo Adventure</Link>
  </nav>
);

const LoggedInNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div>
    <nav id="navbar" className="loggedin">
      <Link
        className={"link-styles"}
        to="/account"
        onMouseEnter={handleMouseEnter}
      >
        Account
      </Link>
      
      <Link className={"link-styles"} to="/planner">Trip Planner</Link>
      <Link className={"link-styles"} to="/dashboard">Dashboard</Link>
      <Link className={"link-home"} to="/">São Paulo Adventure</Link>
    </nav>

    {isDropdownOpen && (
        <div className="dropdown-content" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <Link className={"dropdown-styles"} to="/account/update">Update Information</Link>
            <br></br><br></br>
            <Link className={"dropdown-styles"} to="/account/delete">Delete Account</Link>
            <br></br><br></br>
            <Link className={"dropdown-styles"} to="/logout">Logout</Link>
        </div>
    )}
    </div>
  );
};

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
           <Route path="/signup" element={<SignUpView handleLogin={handleLogin} />}/>
           <Route path="/planner" element={<PlannerView></PlannerView>}/>
           <Route path="/dashboard" element={<DashboardView></DashboardView>}/>
           <Route path="/logout" element={<LogoutView handleLogout={handleLogout} />}/>
           <Route path="/account" element={<AccountView></AccountView>}/>

        </Routes>
     </div>
    </Router>
   );
}

export default App;
