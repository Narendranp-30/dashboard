import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../../styles/Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiver');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password, role });
      const user = response.data.user;

      // Save user data to localStorage
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', role);

      // Set role in AuthContext
      login(role);

      navigate(role === 'donor' ? '/donor-dashboard' : '/receiver-dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__field">
              <input
                type="email"
                placeholder="info@mailaddress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="form__select"
              >
                <option value="receiver">Receiver</option>
                <option value="donor">Donor</option>
              </select>
            </div>
            <div className="form__field">
              <input type="submit" value="Login" />
            </div>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;





// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../Context/AuthContext'; // Import AuthContext
// import '../../styles/Login.scss';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('receiver'); // Default role
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // Button loading state
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext); // Use AuthContext for setting role

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/login', { email, password, role });
//       const user = response.data.user;

//       // Save user data to localStorage
//       localStorage.setItem('userEmail', user.email);
//       localStorage.setItem('userRole', role);

//       // Set role in AuthContext
//       login(role);

//       // Navigate based on role
//       navigate(role === 'donor' ? '/donor-dashboard' : '/receiver-dashboard');
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="container">
//         <div className="login-box">
//           <h2>Login</h2>
//           <form onSubmit={handleSubmit} className="form">
//             <div className="form__field">
//               <input
//                 type="email"
//                 placeholder="info@mailaddress.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//             <div className="form__field">
//               <input
//                 type="password"
//                 placeholder="••••••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//             <div className="form__field">
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//                 className="form__select"
//                 disabled={isLoading}
//               >
//                 <option value="receiver">Receiver</option>
//                 <option value="donor">Donor</option>
//               </select>
//             </div>
//             <div className="form__field">
//               <button type="submit" disabled={isLoading} className="form__submit">
                
//               </button>
//             </div>
//           </form>
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//           <p>
//             Don't have an account?{' '}
//             <Link to="/signup">Sign up here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
