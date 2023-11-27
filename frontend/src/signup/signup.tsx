import './signup.css';

/* class User {
  constructor(public email: string, public password: string) {}
} */

export const SignUpView: React.FC = () => {

  const signUpUser = () => {
    const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value) {
        alert('Please enter both email and password.');
        return;
    }

    // const user = new User(email, password);

    console.log('Signed up successfully with email: '+emailInput.value+' and password: '+passwordInput.value);


    // axios.post('backend api endpoint here', { email, password })
    //   .then(response => console.log('Data sent successfully'))
    //   .catch(error => console.error('Error sending data:', error));

    // wait until the post request is done -> on success, show success page -> redirect to dashboard
    // navigate('/dashboard');
  };


  return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Sign Up</h1>
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="login" className="login-link">Already have an account? Log in here</a>
                <button onClick={signUpUser}>Sign Up</button>
            </div>
        </div>
    );
};
