import React, { useState } from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center gap-3 mb-6">
            <div className="bg-green-600 p-3 rounded-full text-white">
                <TrashIcon />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">EcoTrack</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-2">Username</label>
                <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter username"
                required
                />
            </div>
            <div>
                <label htmlFor="password"className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                required
                />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>
        </div>
        {/* <div className="text-center mt-4 text-sm text-gray-500">
            <p>Admin: admin / password123</p>
            <p>Collector: mike / password123</p> 
        </div> */}
      </div>
    </div>
  );
};

export default Login;
