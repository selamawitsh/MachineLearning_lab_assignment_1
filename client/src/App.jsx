import React, { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    step: "",
    type: "CASH_OUT",
    amount: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    oldbalanceDest: "",
    newbalanceDest: "",
    isFlaggedFraud: "0",
  });

  const [model, setModel] = useState("decision-tree");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      model === "decision-tree"
        ? "http://127.0.0.1:8000/predict-decision-tree"
        : "http://127.0.0.1:8000/predict-logistic";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: parseInt(formData.step),
          type: formData.type,
          amount: parseFloat(formData.amount),
          oldbalanceOrg: parseFloat(formData.oldbalanceOrg),
          newbalanceOrig: parseFloat(formData.newbalanceOrig),
          oldbalanceDest: parseFloat(formData.oldbalanceDest),
          newbalanceDest: parseFloat(formData.newbalanceDest),
          isFlaggedFraud: parseFloat(formData.isFlaggedFraud),
        }),
      });

      const data = await response.json();
      setPrediction(data.fraud_prediction);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error predicting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Fraud Detection App
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-700">Step</label>
            <input
              type="number"
              name="step"
              value={formData.step}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CASH_OUT">CASH_OUT</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="CASH_IN">CASH_IN</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="DEBIT">DEBIT</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                Old Balance (Origin)
              </label>
              <input
                type="number"
                name="oldbalanceOrg"
                value={formData.oldbalanceOrg}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                New Balance (Origin)
              </label>
              <input
                type="number"
                name="newbalanceOrig"
                value={formData.newbalanceOrig}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                Old Balance (Destination)
              </label>
              <input
                type="number"
                name="oldbalanceDest"
                value={formData.oldbalanceDest}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                New Balance (Destination)
              </label>
              <input
                type="number"
                name="newbalanceDest"
                value={formData.newbalanceDest}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Is Flagged Fraud
            </label>
            <select
              name="isFlaggedFraud"
              value={formData.isFlaggedFraud}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="decision-tree">Decision Tree</option>
              <option value="logistic">Logistic Regression</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Prediction Result:
            </h2>
            <p className="text-xl font-medium text-gray-700">
              {prediction === 1
                ? "⚠️ Fraudulent Transaction"
                : "✅ Legitimate Transaction"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
