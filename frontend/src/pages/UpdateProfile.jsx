import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const UpdateProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updateData = {};
    if (firstName.trim()) updateData.firstName = firstName.trim();
    if (lastName.trim()) updateData.lastName = lastName.trim();
    if (password.trim()) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      setError("Please enter at least one field to update.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your profile.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/user/update`,
        updateData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setSuccess(response.data.message || "Profile updated successfully!");

      // Clear sensitive field
      setPassword("");

      // Redirect to signin after short delay (e.g., 2 seconds)
      setTimeout(() => {
        // Clear stored user and token on update, so user needs to re-login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Profile</h1>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="New first name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="New last name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
          {success && (
            <p className="text-center text-sm text-gray-700 mt-2">
              Redirecting to Sign in...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
