import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import YieldPredictionModel, { YieldInputData, YieldPrediction as YieldPred } from '../models/YieldPredictionModel';

interface YieldPredictionProps {
  onBack?: () => void;
}

const YieldPrediction: React.FC<YieldPredictionProps> = ({ onBack }) => {
  const [model] = useState(() => new YieldPredictionModel());
  const [formData, setFormData] = useState({
    cropYear: '',
    season: '',
    state: '',
    area: '',
    annualRainfall: '',
    fertilizerKg: '',
    pesticidesKg: ''
  });

  const [prediction, setPrediction] = useState<YieldPred | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const predictYield = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Wait for model to load if not already loaded
      while (!model.isModelLoaded()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const inputData: YieldInputData = {
        cropYear: formData.cropYear,
        season: formData.season,
        state: formData.state,
        area: parseFloat(formData.area),
        annualRainfall: parseFloat(formData.annualRainfall),
        fertilizer: parseFloat(formData.fertilizerKg),
        pesticides: parseFloat(formData.pesticidesKg)
      };

      const yieldPrediction = await model.predict(inputData);
      setPrediction(yieldPrediction);
    } catch (err) {
      setError('Failed to predict yield. Please check your inputs and try again.');
      console.error('Yield prediction error:', err);
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
            {isLoading ? 'Calculating with AI Model...' : 'Predict Yield'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {prediction && (
          <div className="mt-6 space-y-4">
            {/* Main Prediction */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <TrendingUp className="text-blue-600 mr-2" size={20} />
                  <h3 className="font-semibold text-blue-800">Predicted Yield</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">Confidence: {prediction.confidence}%</div>
                </div>
              </div>
              <p className="text-blue-700 text-2xl font-bold">{prediction.predictedYield} Quintal</p>
              <p className="text-blue-600 text-sm mt-1">
                Expected yield based on ML analysis of your inputs and historical data
              </p>
              
              {/* Confidence bar */}
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Factor Analysis */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Factor Analysis</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rainfall Impact</span>
                    <span>{prediction.factors.rainfall}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${prediction.factors.rainfall}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fertilizer Impact</span>
                    <span>{prediction.factors.fertilizer}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${prediction.factors.fertilizer}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pesticides Impact</span>
                    <span>{prediction.factors.pesticides}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${prediction.factors.pesticides}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Area Efficiency</span>
                    <span>{prediction.factors.area.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, prediction.factors.area)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {prediction.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-3">AI Recommendations</h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-yellow-700">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              * Predictions generated using TensorFlow.js machine learning model
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;