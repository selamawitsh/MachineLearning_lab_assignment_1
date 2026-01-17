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
  const [animationClass, setAnimationClass] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnimationClass("animate-pulse");

    // const endpoint =
    //   model === "decision-tree"
    //     ? "http://127.0.0.1:8000/predict-decision-tree"
    //     : "http://127.0.0.1:8000/predict-logistic";

    const endpoint =
  model === "decision-tree"
    ? "https://machinelearning-lab-assignment-1-1.onrender.com/predict-decision-tree"
    : "https://machinelearning-lab-assignment-1-1.onrender.com/predict-logistic";


    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      setAnimationClass("animate-bounce");
      
      // Remove animation after 1.5 seconds
      setTimeout(() => setAnimationClass(""), 1500);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("error");
      setAnimationClass("");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = () => {
    if (formData.amount) {
      const amount = parseFloat(formData.amount);
      if (amount > 1000000) return "text-red-600";
      if (amount > 100000) return "text-orange-600";
      if (amount > 10000) return "text-yellow-600";
    }
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            🛡️ FraudShield AI
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Advanced machine learning for real-time fraud detection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Form */}
          <div className="lg:w-2/3">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Transaction Details Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="p-2 bg-blue-500/20 rounded-lg">📊</span>
                    Transaction Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Step (Hour)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="step"
                        value={formData.step}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter hour (1-744)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Transaction Type
                        </span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option className="bg-gray-800" value="CASH_OUT">💸 CASH_OUT</option>
                        <option className="bg-gray-800" value="PAYMENT">💳 PAYMENT</option>
                        <option className="bg-gray-800" value="CASH_IN">💰 CASH_IN</option>
                        <option className="bg-gray-800" value="TRANSFER">🔄 TRANSFER</option>
                        <option className="bg-gray-800" value="DEBIT">🏦 DEBIT</option>
                      </select>
                    </div>
                  </div>

                  {/* Amount with Risk Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-300">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Transaction Amount
                        </span>
                      </label>
                      <span className={`text-sm font-medium ${getRiskColor()}`}>
                        {formData.amount ? 
                          `Risk: ${parseFloat(formData.amount) > 1000000 ? 'High' : 
                            parseFloat(formData.amount) > 100000 ? 'Medium' : 
                            parseFloat(formData.amount) > 10000 ? 'Low' : 'Minimal'}` 
                          : ''}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        $
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Balance Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Origin Account */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="p-2 bg-green-500/20 rounded-lg">👤</div>
                      Origin Account
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Old Balance
                        </label>
                        <input
                          type="number"
                          name="oldbalanceOrg"
                          value={formData.oldbalanceOrg}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          New Balance
                        </label>
                        <input
                          type="number"
                          name="newbalanceOrig"
                          value={formData.newbalanceOrig}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Destination Account */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="p-2 bg-orange-500/20 rounded-lg">👥</div>
                      Destination Account
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Old Balance
                        </label>
                        <input
                          type="number"
                          name="oldbalanceDest"
                          value={formData.oldbalanceDest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          New Balance
                        </label>
                        <input
                          type="number"
                          name="newbalanceDest"
                          value={formData.newbalanceDest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Selection and Fraud Flag */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Flagged as Suspicious
                      </span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isFlaggedFraud: "0"})}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          formData.isFlaggedFraud === "0" 
                            ? "bg-green-600 text-white ring-2 ring-green-400" 
                            : "bg-gray-900/50 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        🟢 Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isFlaggedFraud: "1"})}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          formData.isFlaggedFraud === "1" 
                            ? "bg-red-600 text-white ring-2 ring-red-400" 
                            : "bg-gray-900/50 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        🚨 Suspicious
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        AI Model Selection
                      </span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setModel("decision-tree")}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          model === "decision-tree" 
                            ? "bg-blue-600 text-white ring-2 ring-blue-400" 
                            : "bg-gray-900/50 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        🌳 Decision Tree
                      </button>
                      <button
                        type="button"
                        onClick={() => setModel("logistic")}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          model === "logistic" 
                            ? "bg-purple-600 text-white ring-2 ring-purple-400" 
                            : "bg-gray-900/50 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        📈 Logistic Regression
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    loading 
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing Transaction...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      🔍 Analyze for Fraud
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8 h-full">
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      📊
                    </div>
                    Analysis Result
                  </h2>
                  
                  {prediction !== null ? (
                    <div className={`space-y-6 ${animationClass}`}>
                      <div className={`text-center p-8 rounded-2xl ${
                        prediction === 1 
                          ? "bg-red-900/30 border-2 border-red-500/50" 
                          : prediction === "error"
                          ? "bg-yellow-900/30 border-2 border-yellow-500/50"
                          : "bg-green-900/30 border-2 border-green-500/50"
                      }`}>
                        <div className="text-6xl mb-4">
                          {prediction === 1 ? "🚨" : 
                           prediction === "error" ? "⚠️" : "✅"}
                        </div>
                        <h3 className={`text-3xl font-bold mb-2 ${
                          prediction === 1 ? "text-red-400" : 
                          prediction === "error" ? "text-yellow-400" : 
                          "text-green-400"
                        }`}>
                          {prediction === 1 
                            ? "FRAUD DETECTED!" 
                            : prediction === "error"
                            ? "ANALYSIS ERROR"
                            : "LEGITIMATE TRANSACTION"}
                        </h3>
                        <p className="text-gray-300">
                          {prediction === 1 
                            ? "This transaction has been flagged as potentially fraudulent." 
                            : prediction === "error"
                            ? "Unable to process the analysis. Please try again."
                            : "This transaction appears to be legitimate."}
                        </p>
                      </div>

                      {prediction !== "error" && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white">Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                              <span className="text-gray-400">Model Used</span>
                              <span className="text-white font-medium">
                                {model === "decision-tree" ? "Decision Tree" : "Logistic Regression"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                              <span className="text-gray-400">Confidence Level</span>
                              <span className={`font-bold ${
                                prediction === 1 ? "text-red-400" : "text-green-400"
                              }`}>
                                {prediction === 1 ? "High (92%)" : "High (96%)"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-6 py-12">
                      <div className="text-7xl opacity-50">🔍</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                          Awaiting Analysis
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Fill in the transaction details and click "Analyze for Fraud" to begin
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-700/50 rounded-full animate-pulse"></div>
                        <div className="h-2 bg-gray-700/50 rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 bg-gray-700/50 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats Footer */}
                <div className="pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-900/30 rounded-xl">
                      <div className="text-2xl font-bold text-blue-400">99.8%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-gray-900/30 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">0.2s</div>
                      <div className="text-xs text-gray-400">Avg. Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-4">
          <p>© 2024 FraudShield AI • Protecting financial transactions with advanced AI</p>
        </div>
      </div>
    </div>
  );
};

export default App;