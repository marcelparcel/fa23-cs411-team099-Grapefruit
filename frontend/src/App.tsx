import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom"

import HomeView from './home/home';
import LoginView from './login/login';


function App() {
  return (
    <Router> 
     <div>
         <Routes>
           <Route path="/" element={<HomeView></HomeView>}/>
           <Route path="/login" element={<LoginView></LoginView>}/>
         </Routes>
     </div>
    </Router>
   );
}

export default App;
