import React from 'react';
import { Wheat, TrendingUp, Users, MapPin, Thermometer, Shield, Droplets, Bug, Car } from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  const featuredTools = [
    {
      id: 'farmer-query',
      title: 'Farmer Query',
      description: 'Ask anything about farming, crop management and agricultural practices.',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'market-yard',
      title: 'Market Yard',
      description: 'Get real-time market prices, demand forecasts and selling strategies.',
      icon: TrendingUp,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'government-schemes',
      title: 'Government Schemes',
      description: 'Discover eligible government schemes, subsidies and financial support.',
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    }
  ];

  const trendingTools = [
    {
      id: 'crop-recommendation',
      title: 'Crop Recommendation',
      description: 'Get personalized crop suggestions based on soil and climate conditions.',
      icon: Wheat,
      action: () => setCurrentView('crop-recommendation')
    },
    {
      id: 'crop-yield-prediction',
      title: 'Crop Yield Prediction',
      description: 'Predict expected yield based on various agricultural parameters.',
      icon: TrendingUp,
      action: () => setCurrentView('yield-prediction')
    },
    {
      id: 'crop-health',
      title: 'Crop Health',
      description: 'Monitor and analyze crop health using AI-powered diagnostics.',
      icon: Droplets
    },
    {
      id: 'tools-recommendation',
      title: 'Tools Recommendation',
      description: 'Get recommendations for farming tools and equipment.',
      icon: Car
    },
    {
      id: 'weather-forecast',
      title: 'Local Weather Forecast',
      description: 'Get accurate weather predictions for your farming location.',
      icon: Thermometer
    }
  ];

  const aiTools = [
    {
      id: 'pesticides-fertilizer',
      title: 'Pesticides and Fertilizer',
      description: 'Get precise recommendations for fertilizers and pesticides based on crop needs.',
      icon: Bug,
      color: 'bg-blue-100'
    },
    {
      id: 'crop-insurance',
      title: 'Crop Insurance',
      description: 'Find suitable crop insurance policies and calculate premium estimates.',
      icon: Shield,
      color: 'bg-teal-100'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MyKisan AI</h1>
        <p className="text-gray-600">Your intelligent farming companion</p>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured</h2>
        <p className="text-gray-600 text-sm mb-4">Explore our most popular tools</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${tool.color} mr-3`}>
                  <tool.icon size={20} />
                </div>
                <h3 className="font-medium text-gray-900">{tool.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending</h2>
        <p className="text-gray-600 text-sm mb-4">Most used tools by our community</p>
        
        <div className="space-y-3">
          {trendingTools.map((tool, index) => (
            <div 
              key={tool.id} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={tool.action}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-400 mr-4 w-6">{index + 1}</span>
                <div className="flex items-center flex-1">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4">
                    <tool.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{tool.title}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <button className="text-blue-600 text-sm hover:underline">See more</button>
        </div>
      </div>

      {/* By MyKisan AI Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">By MyKisan AI</h2>
        <p className="text-gray-600 text-sm mb-4">AI-powered solutions developed by our team</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiTools.map((tool, index) => (
            <div key={tool.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <span className="text-lg font-semibold text-gray-400 mr-4 w-6">{index + 1}</span>
                <div className={`p-2 rounded-lg ${tool.color} mr-3`}>
                  <tool.icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <button className="text-blue-600 text-sm hover:underline">See more</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;