import React, { useContext, useState, useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { ContextData } from "../../Provider";
import Swal from "sweetalert2";
import logo from '../../assets/images/logo_white.png';
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginWithEmail, setUser, tokenReady, user } = useContext(ContextData);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";



  useEffect(() => {
    if (tokenReady && user) {
      navigate(from, { replace: true });
    }
  }, [tokenReady, user, navigate, from]);




  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await loginWithEmail(email, password);
      const user = result.user;
      const emailData = { email: user.email };

      // Request to get JWT token
      const res = await axios.post('https://api.rm.toolscare.net/jwt', emailData);
      if (res.data.token) {
        localStorage.setItem('jwtToken', res.data.token); // Store token in localStorage
        setUser(user); // Set the user context
        navigate(from, { replace: true }); // Redirect after login
        Swal.fire({
          title: 'Login successful',
          icon: 'success',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };



  return (
    <div className="">
      <div className="fanwood flex justify-center items-center lg:py-8 px-4 bg-gray-800 h-[100vh]">
        <div className="flex flex-col bg-gray-700 lg:p-14 md:p-10 p-5 lg:w-1/2 md:w-2/3 gap-3 mx-auto max-w-screen-2xl lg:bg-opacity-90 shadow-md border rounded-md">
          <div className="text-center text-4xl text-white font-bold">
            {/* <img src={logo} alt="" /> */}
            <h2>TOOLS CARE</h2>
          </div>


          <form className="flex flex-col gap-5 mt-5" onSubmit={handleEmailLogin}>
            <label className="input input-bordered flex items-center gap-2">
              <MdOutlineMail />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 relative">
              <RiLockPasswordLine />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full pr-5"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer"
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </label>

            <button className="py-2 px-5 rounded-md w-full custom-button bg-green-500 text-white">
              Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
