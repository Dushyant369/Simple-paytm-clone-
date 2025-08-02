import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/v1/user/bulk`, { params: { filter } })
      .then((response) => {
        setUsers(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <div className="flex items-center">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex items-center justify-center mr-2">
          <div className="text-xl font-semibold">
            {user.firstName ? user.firstName[0].toUpperCase() : "?"}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => {
            navigate("/send?id=" + user._id + "&name=" + encodeURIComponent(user.firstName));
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
