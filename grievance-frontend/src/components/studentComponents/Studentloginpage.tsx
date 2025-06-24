// "use client";
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import AdminLoginPage from "../components/Adminloginpage";
// import { useRouter } from 'next/navigation';

// export default function StudentLoginPage({ onLogin }: { onLogin?: (user: any, token: string) => void }) {
//   const [rollNo, setRollNo] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const [showAdminLogin, setShowAdminLogin] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("https://grievanceportal.vercel.app/api/v1/users/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rollNumber: rollNo, password }),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       // Use AuthContext login
//       login(data, 'student');

//       if (onLogin) {
//         onLogin(data, data.token || data.userType);
//       }

//       // Redirect to dashboard
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100">
//       {showAdminLogin ? (
//         <AdminLoginPage onSwitchToStudent={() => setShowAdminLogin(false)}/>
//       ) : (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded shadow-md w-full max-w-sm"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>
//           {error && (
//             <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
//           )}
//           <div className="mb-4">
//             <label className="block mb-1 font-medium" htmlFor="rollNo">
//               Roll Number
//             </label>
//             <input
//               id="rollNo"
//               type="text"
//               value={rollNo}
//               onChange={(e) => setRollNo(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               placeholder="Enter your roll number"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block mb-1 font-medium" htmlFor="password">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//           <p className="mt-4 text-center text-sm">
//             Are you an admin?{" "}
//             <button onClick={() => setShowAdminLogin(true)} className="text-blue-600 hover:underline">
//               Go to Admin Login
//             </button>
//           </p>
//         </form>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminLoginPage from "../adminComponents/Adminloginpage";
import { useRouter } from 'next/navigation';

export default function StudentLoginPage({ onLogin }: { onLogin?: (user: any, token: string) => void }) {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://grievanceportal.vercel.app/api/v1/users/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: rollNo, password }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Use AuthContext login
      login(data, 'student');

      if (onLogin) {
        onLogin(data.user, data.token); // Pass user object and token
      }

      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
      </div>
      
      {showAdminLogin ? (
        <AdminLoginPage onSwitchToStudent={() => setShowAdminLogin(false)}/>
      ) : (
        <div className="relative group">
          {/* Animated Lamp */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out group-hover:translate-y-8 z-10">
            {/* Lamp cord */}
            <div className="w-0.5 h-24 bg-yellow-300 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Lamp fixture */}
            <div className="relative">
              {/* Lamp shade */}
              <div className="w-16 h-12 bg-gradient-to-b from-white to-gray-200 rounded-b-full border-2 border-yellow-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 to-yellow-300/30"></div>
              </div>
              
              {/* Light bulb glow */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Lamp aura/light effect */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 opacity-0 group-hover:opacity-60 transition-all duration-700 ease-out group-hover:w-96 group-hover:h-96">
                <div className="w-full h-full bg-gradient-radial from-yellow-200/40 via-yellow-100/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-yellow-400 p-8 rounded-lg shadow-2xl w-full max-w-sm relative z-20 transition-all duration-300 group-hover:shadow-yellow-400/50 group-hover:shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-black">
              Student Login
            </h2>
            
            {error && (
              <div className="mb-4 text-black bg-yellow-200 border border-yellow-400 p-2 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-black" htmlFor="rollNo">
                Roll No
              </label>
              <input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-black placeholder-gray-500 transition-all duration-300"
                required
                placeholder="Enter your roll no"
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-black placeholder-gray-500 transition-all duration-300"
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-yellow-400 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <p className="mt-6 text-center text-black">
              Are you an admin?{" "}
              <button 
                type="button"
                onClick={() => setShowAdminLogin(true)} 
                className="text-yellow-600 hover:text-yellow-400 font-semibold hover:underline transition-colors duration-300"
              >
                Go to Admin Login
              </button>
            </p>
          </form>
        </div>
      )}
      
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}