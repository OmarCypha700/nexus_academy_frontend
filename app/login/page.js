// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:8000/api/auth/login/", {
//         username,
//         password,
//       });

//       login(res.data.access);
//       router.push("/courses");
//     } catch (err) {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left side - Image (hidden on small screens) */}
//       <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-100">
//         <img
//           src="/login-illustration.svg" // replace with your image path
//           alt="Login illustration"
//           className="max-w-md"
//         />
//       </div>

//       {/* Right side - Login form */}
//       <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
//         <div className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow">
//           <h2 className="text-3xl font-semibold text-gray-800">Login</h2>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/login/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/app/components/ui/button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        router.push('/courses');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}