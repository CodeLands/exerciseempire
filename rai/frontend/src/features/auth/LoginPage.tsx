import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from './AuthContext';

// Define the zod schema for validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string, password?: string }>({});
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setValidationErrors({});
    setErrorMessage('');

    // Validate input using zod schema
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      // Extract validation errors and set them in state
      const errors: { email?: string, password?: string } = {};
      result.error.errors.forEach(error => {
        if (error.path[0] === 'email') errors.email = error.message;
        if (error.path[0] === 'password') errors.password = error.message;
      });
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    console.log('Logging in with:', email, password);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();

      if (responseJson.success) {
        console.log('Login successful:', responseJson);

        setToken(responseJson.data.token);
        setUser(responseJson.data.user); // Assuming the user data is returned in the response

        setTimeout(() => {
          navigate('/home');
        }, 1000);
        //navigate('/home');
      } else {
        console.error('Login failed:', responseJson);
        // Handle error response
        if (!responseJson.errors) {
          setErrorMessage('Authentication failed. Unknown error.');
        } else {
          setErrorMessage(responseJson.errors);
        }
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative -space-y-px rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={`relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${validationErrors.email ? 'ring-red-500' : ''}`}
                placeholder="Email address"
                disabled={isLoading}
              />
              {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={`relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${validationErrors.password ? 'ring-red-500' : ''}`}
                placeholder="Password"
                disabled={isLoading}
              />
              {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm leading-6">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}
        </form>

        <p className="text-center text-sm leading-6 text-gray-500">
          Not a member?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Go to register
          </Link>
        </p>
      </div>
    </div>
  );
}
