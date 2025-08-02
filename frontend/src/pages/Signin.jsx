import { useState } from "react";
import { BottomWarning } from '../components/BottomWarning';
import { Button } from "../components/Button";
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from "../components/InputBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/user/signin`, {
        username: email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Sign in" />
          <SubHeading label="Enter your credentials to access your account" />
          <form onSubmit={handleSignin} className="flex flex-col gap-3">
            <InputBox
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              label="Email"
              type="email"
            />
            <InputBox
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="123456"
              label="Password"
              type="password"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              label={loading ? "Signing in..." : "Sign in"}
              type="submit"
              disabled={loading}
            />
          </form>
          <BottomWarning label="Don't have an account ?" buttonText="Sign up" to="/signup" />
        </div>
      </div>
    </div>
  );
};
