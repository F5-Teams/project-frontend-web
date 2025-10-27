"use client";

import { useState } from "react";

const LoginTestPage = () => {
  const [username, setUsername] = useState("customer1");
  const [password, setPassword] = useState("customer123");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResult, setApiResult] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Try different login endpoints
      const endpoints = [
        "/auth/login",
        "/login",
        "/users/login",
        "/api/auth/login",
        "/api/login",
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(`http://localhost:8080${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (response.ok) {
            break;
          }
        } catch (err) {
          lastError = err;
        }
      }

      if (!response || !response.ok) {
        throw new Error(
          `Login failed. Last error: ${lastError?.message || "Unknown error"}`
        );
      }

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setError("");
      } else if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setError("");
      } else {
        throw new Error("No token found in response");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/bookings/combos/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setApiResult(
          `✅ API Success! Found ${data.length} combos: ${JSON.stringify(
            data,
            null,
            2
          )}`
        );
      } else {
        const errorData = await response.json();
        setApiResult(`❌ API Error: ${errorData.message}`);
      }
    } catch (err: any) {
      setApiResult(`❌ Network Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Login Test</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="customer1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="customer123"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {token && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Token:</label>
              <div className="p-2 bg-gray-100 rounded text-xs break-all">
                {token.substring(0, 50)}...
              </div>

              <button
                onClick={testAPI}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Test API
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          {apiResult && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              <pre className="whitespace-pre-wrap">{apiResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginTestPage;
