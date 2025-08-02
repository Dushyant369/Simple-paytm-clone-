import { useEffect, useState } from "react";
import axios from "axios";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { AppBar } from "../components/AppBar";



export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    setUser(JSON.parse(storedUser));
  } else {
    setUser(null);
  }
}, []);


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(`simple-paytm-anbu.onrender.com//api/v1/account/balance`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setBalance(response.data.balance);
      } catch (err) {
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
            <AppBar user={user} />
      <main className="m-8">
        {loading && <div>Loading balance...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && <Balance value={balance ?? 0} />}
        <Users />
      </main>
    </div>
  );
};
