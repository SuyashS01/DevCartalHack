// /client/src/pages/login.js

const Login = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login with GitHub</h2>
      <a href="http://localhost:4000/auth/github">
        <button style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#24292e",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Login with GitHub
        </button>
      </a>
    </div>
  );
};

export default Login;
