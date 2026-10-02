import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import UserCard from "./UserCard";

// "Who to follow" sidebar widget
export default function Suggestions() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    api
      .get("/users/suggestions")
      .then((res) => setUsers(res.data.users))
      .catch(() => setUsers([]));
  }, []);

  if (!users || users.length === 0) return null;

  return (
    <div className="card p-4">
      <h3 className="mb-2 px-2 font-bold">Who to follow</h3>
      <div className="space-y-1">
        {users.map((u) => (
          <UserCard key={u._id} user={u} compact />
        ))}
      </div>
      <Link to="/explore" className="mt-2 block px-2 text-sm font-medium text-brand-500 hover:underline">
        Find more people
      </Link>
    </div>
  );
}
