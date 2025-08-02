import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = "https://simple-paytm-anbu.onrender.com";




export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/user/signup`, {
        username,
        firstName,
        lastName,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-6">
        <Heading label="Signup" />
        <SubHeading label="Enter your information to create an account" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputBox
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label="First Name"
          />
          <InputBox
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label="Last Name"
          />
          <InputBox
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe@gmail.com"
            label="Email"
            type="email"
          />
          <InputBox
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123654"
            label="Password"
            type="password"
          />

          {error && <div className="text-red-600">{error}</div>}

          <Button type="submit" label={loading ? "Signing up..." : "Signup"} disabled={loading} />
        </form>

        <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
      </div>
    </div>
  );
};
