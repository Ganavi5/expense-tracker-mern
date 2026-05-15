import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={container}>
      <h1 style={{ color: "#fff" }}>💸 Expense Tracker</h1>

      <p style={{ color: "#eee" }}>
        Track your expenses smartly
      </p>

      <div>
        <button style={btn} onClick={() => navigate("/login")}>
          Login
        </button>

        <button style={btnOutline} onClick={() => navigate("/register")}>
          Signup
        </button>
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeIn 1s ease-in"
};

const btn = {
  padding: "12px 20px",
  margin: "10px",
  background: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnOutline = {
  ...btn,
  background: "transparent",
  border: "1px solid #fff",
  color: "#fff"
};

export default Home;