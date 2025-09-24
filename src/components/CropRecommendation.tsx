import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface CropRecommendationProps {
  onBack?: () => void;
}

const CropRecommendation: React.FC<CropRecommendationProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphate: '',
    potassium: '',
    temp: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRecommendation = () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const crops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Soybean'];
      const conditions = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphate: parseFloat(formData.phosphate),
        potassium: parseFloat(formData.potassium),
        temp: parseFloat(formData.temp),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall)
      };

      // Simple recommendation logic based on conditions
      let recommendedCrop = 'Coffee Wheat'; // Default as shown in screenshot
      
      if (conditions.ph >= 6.0 && conditions.ph <= 7.5 && conditions.temp >= 20 && conditions.temp <= 30) {
        if (conditions.rainfall >= 500) {
          recommendedCrop = 'Rice';
        } else if (conditions.nitrogen >= 50) {
          recommendedCrop = 'Wheat';
        }
      } else if (conditions.temp >= 25 && conditions.humidity >= 60) {
        recommendedCrop = 'Cotton';
      }

      setRecommendation(recommendedCrop);
      setIsLoading(false);
    }, 2000);
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Crop Recommendation</h2>
        <p className="text-gray-600 mb-6">Enter your soil and climate parameters to get personalized crop recommendations</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nitrogen
              <span className="text-gray-400 ml-1">(kg/hectare)</span>
            </label>
            <input
              type="number"
              value={formData.nitrogen}
              onChange={(e) => handleInputChange('nitrogen', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter nitrogen content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phosphate
              <span className="text-gray-400 ml-1">(kg/hectare)</span>
            </label>
            <input
              type="number"
              value={formData.phosphate}
              onChange={(e) => handleInputChange('phosphate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phosphate content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potassium
              <span className="text-gray-400 ml-1">(kg/hectare)</span>
            </label>
            <input
              type="number"
              value={formData.potassium}
              onChange={(e) => handleInputChange('potassium', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter potassium content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature
              <span className="text-gray-400 ml-1">(°C)</span>
            </label>
            <input
              type="number"
              value={formData.temp}
              onChange={(e) => handleInputChange('temp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter average temperature"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humidity
              <span className="text-gray-400 ml-1">(%)</span>
            </label>
            <input
              type="number"
              value={formData.humidity}
              onChange={(e) => handleInputChange('humidity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter humidity percentage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              pH
              <span className="text-gray-400 ml-1">(0-14)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.ph}
              onChange={(e) => handleInputChange('ph', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter soil pH level"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rainfall
              <span className="text-gray-400 ml-1">(mm/year)</span>
            </label>
            <input
              type="number"
              value={formData.rainfall}
              onChange={(e) => handleInputChange('rainfall', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter annual rainfall"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={generateRecommendation}
            disabled={isLoading || Object.values(formData).some(val => !val)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Get Crop Recommendation'}
          </button>
        </div>

        {recommendation && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Info className="text-green-600 mr-2" size={20} />
              <h3 className="font-semibold text-green-800">Recommended Crop</h3>
            </div>
            <p className="text-green-700 text-lg font-medium">{recommendation}</p>
            <p className="text-green-600 text-sm mt-1">
              Based on your soil and climate conditions, this crop is most suitable for optimal yield.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;