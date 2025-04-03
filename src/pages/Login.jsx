import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EduraLogo from "../components/EduraLogo";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "ohitstrin" && password === "Edura01!") {
      localStorage.setItem("userType", "student");
      onLogin?.(); // Callback to lift state if passed
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleEducatorLogin = () => {
    localStorage.setItem("userType", "educator");
    navigate("/institution");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <EduraLogo className="h-20 mb-6" />

      <button
        onClick={handleEducatorLogin}
        className="block w-full max-w-sm mb-4 bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900"
      >
        Educator Login
      </button>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Log in to Edura</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
