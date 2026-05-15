import { useEffect, useState } from "react";
import API from "../services/api";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({
        amount: "",
        category: "",
    });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("token");

    const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

    // fetch expenses
    const fetchExpenses = async () => {
        const res = await API.get("/expenses", {
            headers: { Authorization: token },
        });
        setExpenses(res.data);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ADD / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.amount || !form.category) return;

        if (editId) {
            await API.put(`/expenses/${editId}`, {
                ...form,
                amount: Number(form.amount),
            }, {
                headers: { Authorization: token },
            });
            setEditId(null);
        } else {
            await API.post("/expenses", {
                ...form,
                amount: Number(form.amount),
            }, {
                headers: { Authorization: token },
            });
        }

        setForm({ amount: "", category: "" });
        fetchExpenses();
    };

    // DELETE
    const deleteExpense = async (id) => {
        await API.delete(`/expenses/${id}`, {
            headers: { Authorization: token },
        });
        fetchExpenses();
    };

    // CATEGORY TOTALS
    const getCategoryTotals = () => {
        const totals = {};
        expenses.forEach((exp) => {
            if (!totals[exp.category]) totals[exp.category] = 0;
            totals[exp.category] += exp.amount;
        });
        return totals;
    };

    // CHART DATA
    const getChartData = () => {
        const totals = getCategoryTotals();
        return {
            labels: Object.keys(totals),
            datasets: [
                {
                    data: Object.values(totals),
                    backgroundColor: [
                        "#ff6384",
                        "#36a2eb",
                        "#ffce56",
                        "#4bc0c0",
                        "#9966ff",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // INSIGHT
    const getInsight = () => {
        const totals = getCategoryTotals();
        if ((totals["Food"] || 0) > 2000) return "⚠️ You overspent on Food";
        if ((totals["Travel"] || 0) > 3000) return "⚠️ Travel expenses are high";
        return "✅ Spending looks good";
    };

    const totalAmount = expenses.reduce((a, b) => a + b.amount, 0);

    return (
        <div style={{
            maxWidth: "900px",
            margin: "auto",
            padding: "20px",
            fontFamily: "Arial",
            color: "#fff"
        }}>

            {/* TOP CARDS */}
            <div style={{ display: "flex", gap: "20px" }}>
                <div style={card}>
                    <h3>Total Spending</h3>
                    <h2>₹{totalAmount}</h2>
                </div>

                <div style={card}>
                    <h3>Insight</h3>
                    <p>{getInsight()}</p>
                </div>
            </div>

            {/* FORM */}
            <div style={card}>
                <h3>{editId ? "Edit Expense" : "Add Expense"}</h3>

                <input
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                    }
                    style={input}
                />

                <select
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                    style={input}
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>

                <button onClick={handleSubmit} style={btn}>
                    {editId ? "Update" : "Add"}
                </button>
            </div>

            {/* CHART */}
            <div style={card}>
                <h3>Analytics</h3>
                <Pie data={getChartData()} />
            </div>

            {/* LIST */}
            <div style={card}>
                <h3>Transactions</h3>

                {expenses.map((exp) => (
                    <div key={exp._id} style={row}>
                        <span>{exp.category} - ₹{exp.amount}</span>

                        <div>
                            <button onClick={() => {
                                setForm({
                                    amount: exp.amount,
                                    category: exp.category
                                });
                                setEditId(exp._id);
                            }}>
                                Edit
                            </button>

                            <button onClick={() => deleteExpense(exp._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

// STYLES
const card = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    margin: "20px 0",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
};

const input = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

const btn = {
    padding: "10px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
};

const row = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee"
};

export default Dashboard;