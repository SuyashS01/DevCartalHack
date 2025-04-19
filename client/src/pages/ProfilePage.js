// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import GitHubProfile from "../components/GitHubProfile";

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
            credentials: "include"
          });
           // assumes proxy is set or same domain
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (err) return <div className="p-4 text-red-600 text-center">Error: {err}</div>;

  return <GitHubProfile data={data} />;
};

export default ProfilePage;
