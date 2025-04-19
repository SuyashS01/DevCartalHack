import React from "react";

const ProfileOverview = ({ profile }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">👤 Profile Overview</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Username:</strong> {profile.login}</p>
      <p><strong>Email:</strong> {profile.email || "N/A"}</p>
      <p><strong>Followers:</strong> {profile.followers}</p>
      <p><strong>Following:</strong> {profile.following}</p>
      <p><strong>Public Repos:</strong> {profile.public_repos}</p>
    </div>
  );
};

export default ProfileOverview;
