import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();  // <-- initialize here
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/account/transfer`,
        {
          to: id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      setSuccess("Transfer successful!");
        setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Transfer failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the timeout if component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name ? name[0].toUpperCase() : "?"}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name || "Unknown"}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="number"
                  min={1}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                />
              </div>
              <button
                onClick={handleTransfer}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                disabled={loading || !amount || amount <= 0}
              >
                {loading ? "Transferring..." : "Initiate Transfer"}
              </button>
              {error && (
                <div className="text-red-500 text-center text-sm">{error}</div>
              )}
              {success && (
                <div className="text-green-600 text-center text-sm">{success}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
