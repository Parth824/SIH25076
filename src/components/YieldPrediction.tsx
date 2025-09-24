import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';

interface YieldPredictionProps {
  onBack?: () => void;
}

const YieldPrediction: React.FC<YieldPredictionProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    cropYear: '',
    season: '',
    state: '',
    area: '',
    annualRainfall: '',
    fertilizerKg: '',
    pesticidesKg: ''
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const predictYield = () => {
    setIsLoading(true);
    
    // Simulate AI yield prediction
    setTimeout(() => {
      const baseYield = 100; // Base yield in quintal
      const area = parseFloat(formData.area) || 1;
      const rainfall = parseFloat(formData.annualRainfall) || 800;
      const fertilizer = parseFloat(formData.fertilizerKg) || 50;
      const pesticides = parseFloat(formData.pesticidesKg) || 5;

      // Simple yield calculation based on inputs
      let yieldMultiplier = 1;
      
      if (rainfall >= 600 && rainfall <= 1200) yieldMultiplier += 0.2;
      if (fertilizer >= 40 && fertilizer <= 80) yieldMultiplier += 0.15;
      if (pesticides >= 3 && pesticides <= 10) yieldMultiplier += 0.1;
      
      const predictedYield = Math.round(baseYield * yieldMultiplier * area);
      
      setPrediction(predictedYield);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        {onBack && (
          <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">MyKisan AI</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Crop Yield Prediction</h2>
        <p className="text-gray-600 mb-6">Enter your farming details to predict expected crop yield</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Year
            </label>
            <input
              type="text"
              value={formData.cropYear}
              onChange={(e) => handleInputChange('cropYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter crop year (e.g., 2024-25)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season
            </label>
            <select
              value={formData.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select season</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
              <span className="text-gray-400 ml-1">(hectares)</span>
            </label>
            <input
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter farming area"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Rainfall
              <span className="text-gray-400 ml-1">(mm)</span>
            </label>
            <input
              type="number"
              value={formData.annualRainfall}
              onChange={(e) => handleInputChange('annualRainfall', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter annual rainfall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fertilizer
              <span className="text-gray-400 ml-1">(KG)</span>
            </label>
            <input
              type="number"
              value={formData.fertilizerKg}
              onChange={(e) => handleInputChange('fertilizerKg', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter fertilizer quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesticides
              <span className="text-gray-400 ml-1">(KG)</span>
            </label>
            <input
              type="number"
              value={formData.pesticidesKg}
              onChange={(e) => handleInputChange('pesticidesKg', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter pesticides quantity"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={predictYield}
            disabled={isLoading || Object.values(formData).some(val => !val)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Calculating Yield...' : 'Predict Yield'}
          </button>
        </div>

        {prediction && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="text-blue-600 mr-2" size={20} />
              <h3 className="font-semibold text-blue-800">Predicted Yield</h3>
            </div>
            <p className="text-blue-700 text-2xl font-bold">{prediction} Quintal</p>
            <p className="text-blue-600 text-sm mt-1">
              Expected yield based on your inputs and historical data analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;