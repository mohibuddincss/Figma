import React, { useState } from 'react'
import { supabase } from '../config/supabase'
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/reducer/userSlice';

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data: authData, error: authEror } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authEror) {
        alert(authEror.message)
        return
      }

   const { data: userData, error: dbError } = await supabase
  .from('users')
  .select('*')
  .eq('id', authData.user.id)
  .maybeSingle();

      if (!userData) {
  alert("User profile not found in database");
  return;
}

      if (dbError) {
        alert('Faild to fetch user Data' + dbError.message);
        return;
      }

      dispatch(loginUser(userData))
      navigate('/dashboard');

    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;