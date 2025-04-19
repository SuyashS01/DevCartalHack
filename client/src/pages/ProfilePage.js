// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import ProfileOverview from "../components/designe/ProfileOverview";
import Stats from "../components/designe/Stats";
import TopRepositories from "../components/designe/TopRepositories";
import RecentlyUpdatedRepos from "../components/designe/RecentlyUpdatedRepos";

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
          credentials: "include",
        });
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your GitHub Profile Dashboard</h1>
      
      {/* Profile Overview */}
      <ProfileOverview profile={data.profile} />
      
      {/* Stats */}
      <Stats stats={data.stats} />
      
      {/* Top Repositories */}
      <TopRepositories topRepos={data.stats.topRepos} />
      
      {/* Recently Updated Repos */}
      <RecentlyUpdatedRepos recentRepos={data.recentRepos} />
    </div>
  );
};

export default ProfilePage;



// import React, { useEffect, useState } from "react";
// import GitHubProfile from "../components/GitHubProfile";

// const ProfilePage = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/profile", {
//             credentials: "include"
//           });
//            // assumes proxy is set or same domain
//         if (!res.ok) throw new Error("Failed to fetch");
//         const json = await res.json();
//         setData(json);
//       } catch (e) {
//         setErr(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (err) return <div className="p-4 text-red-600 text-center">Error: {err}</div>;

//   return <GitHubProfile data={data} />;
// };

// export default ProfilePage;
