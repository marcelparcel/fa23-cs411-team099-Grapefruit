import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface LoginViewProps {
  handleLogin: () => void;
}

export const SignUpView: React.FC<LoginViewProps> = ({ handleLogin }) => {
  const navigate = useNavigate();

  const signUpUser = async () => {
    const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value) {
        alert('Please enter both email and password.');
        return;
    }

    var signup = await axios.post('http://localhost:4000/user', { 
        params: {
          email: emailInput.value,
          password: passwordInput.value
          // add name 
        }
    });

    if (Object.keys(signup)) {
      console.log('Signed up successfully with email: '+emailInput.value+' and password: '+passwordInput.value);
      handleLogin();
      navigate('/planner');
    } else {
      console.log("unable to sign up :(");
    }
  };

  return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Sign Up</h1>
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="login" className="login-link">Already have an account? Log in here</a>
                <button onClick={signUpUser}>Sign Up</button>
            </div>
        </div>
    );
};
