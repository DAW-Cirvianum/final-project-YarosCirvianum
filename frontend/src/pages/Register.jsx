import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Unexpected error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create account
        </h2>

        {["name", "username", "email", "password", "password_confirmation"].map(
          (field) => (
            <div key={field} className="mb-3">
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={field.replace("_", " ")}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field][0]}</p>
              )}
            </div>
          )
        )}

        {errors.general && (
          <p className="text-red-500 text-sm mb-3">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}
