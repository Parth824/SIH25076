import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import CropRecommendationModel, { CropInputData, CropPrediction } from '../models/CropRecommendationModel';

interface CropRecommendationProps {
  onBack?: () => void;
}

const CropRecommendation: React.FC<CropRecommendationProps> = ({ onBack }) => {
  const [model] = useState(() => new CropRecommendationModel());
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphate: '',
    potassium: '',
    temp: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [predictions, setPredictions] = useState<CropPrediction[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Wait for model to load if not already loaded
      while (!model.isModelLoaded()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const inputData: CropInputData = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphate),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temp),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall)
      };

      const cropPredictions = await model.predict(inputData);
      setPredictions(cropPredictions);
    } catch (err) {
      setError('Failed to generate crop recommendations. Please try again.');
      console.error('Crop recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading ? 'Analyzing with AI Model...' : 'Get Crop Recommendation'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {predictions && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Info className="text-blue-600 mr-2" size={20} />
              AI Crop Recommendations
            </h3>
            
            {predictions.map((prediction, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                index === 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className={`font-medium ${
                      index === 0 ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {index + 1}. {prediction.crop}
                      {index === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Best Match</span>}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      index === 0 ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {prediction.confidence.toFixed(1)}% Confidence
                    </div>
                    <div className={`text-xs ${
                      index === 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      Suitability: {prediction.suitabilityScore.toFixed(0)}/100
                    </div>
                  </div>
                </div>
                
                {/* Confidence bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
                
                {index === 0 && (
                  <p className="text-green-600 text-sm">
                    This crop is most suitable based on your soil and climate conditions.
                  </p>
                )}
              </div>
            ))}
            
            <div className="text-xs text-gray-500 mt-4">
              * Recommendations generated using machine learning model trained on agricultural data
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;