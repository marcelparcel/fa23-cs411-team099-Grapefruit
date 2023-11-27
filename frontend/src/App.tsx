import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom"

import HomeView from './home/home';
import LoginView from './login/login';
import { SignUpView } from './signup/signup';


function App() {
  return (
    <Router> 
      <div className="main">
        <nav id="navbar" className="nologin">
          <Link className={"link-styles"} to="/login">Login</Link>
          <Link className={"link-styles"} to="/">Home</Link>
        </nav>

        <Routes>
           <Route path="/" element={<HomeView></HomeView>}/>
           <Route path="/login" element={<LoginView></LoginView>}/>
           <Route path="/signup" element={<SignUpView></SignUpView>}/>
        </Routes>
     </div>
    </Router>
   );
}

export default App;
