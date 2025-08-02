import React from "react";
import { useNavigate } from "react-router-dom";

export const AppBar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <header className="shadow h-14 flex justify-between items-center px-4 bg-white">
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/");
          }
        }}
      >
        PayTM App
      </div>
      <div className="flex items-center gap-4">
          <button
          onClick={() => navigate("/update-profile")}
          className="text-black-600 underline text-sm"
          type="button"
        >
          Update Profile
        </button>
        <div>Hello, {user ? user.firstName : "Guest"}</div>

        <div className="rounded-full h-12 w-12 bg-slate-200 flex items-center justify-center text-xl font-bold">
          {user && user.firstName ? user.firstName[0].toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
};
