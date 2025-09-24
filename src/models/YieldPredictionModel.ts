import * as tf from '@tensorflow/tfjs';

export interface YieldInputData {
  cropYear: string;
  season: string;
  state: string;
  area: number;
  annualRainfall: number;
  fertilizer: number;
  pesticides: number;
}

export interface YieldPrediction {
  predictedYield: number;
  confidence: number;
  factors: {
    rainfall: number;
    fertilizer: number;
    pesticides: number;
    area: number;
  };
  recommendations: string[];
}

class YieldPredictionModel {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  // Normalization parameters for yield prediction
  private normalizationParams = {
    area: { min: 0.1, max: 1000 },
    rainfall: { min: 200, max: 3000 },
    fertilizer: { min: 0, max: 500 },
    pesticides: { min: 0, max: 50 }
  };

  // Season encoding
  private seasonEncoding = {
    'kharif': [1, 0, 0],
    'rabi': [0, 1, 0],
    'summer': [0, 0, 1]
  };

  // State yield factors (simplified)
  private stateFactors: { [key: string]: number } = {
    'punjab': 1.2,
    'haryana': 1.15,
    'uttar pradesh': 1.0,
    'bihar': 0.9,
    'west bengal': 1.1,
    'maharashtra': 1.05,
    'karnataka': 1.0,
    'tamil nadu': 1.1,
    'andhra pradesh': 1.05,
    'telangana': 1.0,
    'gujarat': 1.1,
    'rajasthan': 0.85,
    'madhya pradesh': 0.95,
    'odisha': 0.9
  };

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Create neural network for yield prediction
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [7], // area, rainfall, fertilizer, pesticides, season(3)
            units: 64,
            activation: 'relu',
            kernelInitializer: 'randomNormal'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 32,
            activation: 'relu',
            kernelInitializer: 'randomNormal'
          }),
          tf.layers.dropout({ rate: 0.1 }),
          tf.layers.dense({
            units: 16,
            activation: 'relu',
            kernelInitializer: 'randomNormal'
          }),
          tf.layers.dense({
            units: 1,
            activation: 'linear' // Linear activation for regression
          })
        ]
      });

      // Compile for regression
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mae']
      });

      // Train with synthetic data
      await this.simulateTraining();
      
      this.isLoaded = true;
      console.log('Yield prediction model loaded successfully');
    } catch (error) {
      console.error('Error initializing yield prediction model:', error);
    }
  }

  private async simulateTraining() {
    const batchSize = 200;
    const epochs = 10;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const { inputs, outputs } = this.generateYieldData(batchSize);
      
      await this.model!.fit(inputs, outputs, {
        epochs: 1,
        verbose: 0,
        shuffle: true
      });
    }
  }

  private generateYieldData(batchSize: number) {
    const inputs: number[][] = [];
    const outputs: number[] = [];

    for (let i = 0; i < batchSize; i++) {
      const area = Math.random() * 100 + 1;
      const rainfall = Math.random() * 1500 + 500;
      const fertilizer = Math.random() * 200 + 20;
      const pesticides = Math.random() * 20 + 2;
      
      // Random season
      const seasons = ['kharif', 'rabi', 'summer'];
      const season = seasons[Math.floor(Math.random() * seasons.length)];
      const seasonVec = this.seasonEncoding[season as keyof typeof this.seasonEncoding];

      // Calculate realistic yield based on inputs
      const baseYield = 25; // quintals per hectare
      let yieldMultiplier = 1;

      // Rainfall effect
      if (rainfall >= 600 && rainfall <= 1200) yieldMultiplier += 0.3;
      else if (rainfall < 400 || rainfall > 2000) yieldMultiplier -= 0.2;

      // Fertilizer effect
      if (fertilizer >= 50 && fertilizer <= 150) yieldMultiplier += 0.25;
      else if (fertilizer < 20) yieldMultiplier -= 0.15;

      // Pesticides effect
      if (pesticides >= 5 && pesticides <= 15) yieldMultiplier += 0.15;
      else if (pesticides > 25) yieldMultiplier -= 0.1;

      // Season effect
      if (season === 'kharif') yieldMultiplier += 0.1;
      else if (season === 'rabi') yieldMultiplier += 0.15;

      const totalYield = baseYield * yieldMultiplier * area;

      inputs.push([area, rainfall, fertilizer, pesticides, ...seasonVec]);
      outputs.push(Math.max(0, totalYield + (Math.random() - 0.5) * 10)); // Add some noise
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor1d(outputs)
    };
  }

  private normalizeInput(data: YieldInputData): number[] {
    const season = data.season.toLowerCase();
    const seasonVec = this.seasonEncoding[season as keyof typeof this.seasonEncoding] || [0, 0, 0];

    return [
      (data.area - this.normalizationParams.area.min) / 
      (this.normalizationParams.area.max - this.normalizationParams.area.min),
      
      (data.annualRainfall - this.normalizationParams.rainfall.min) / 
      (this.normalizationParams.rainfall.max - this.normalizationParams.rainfall.min),
      
      (data.fertilizer - this.normalizationParams.fertilizer.min) / 
      (this.normalizationParams.fertilizer.max - this.normalizationParams.fertilizer.min),
      
      (data.pesticides - this.normalizationParams.pesticides.min) / 
      (this.normalizationParams.pesticides.max - this.normalizationParams.pesticides.min),
      
      ...seasonVec
    ];
  }

  async predict(inputData: YieldInputData): Promise<YieldPrediction> {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded yet');
    }

    try {
      // Normalize input
      const normalizedInput = this.normalizeInput(inputData);
      
      // Make prediction
      const prediction = this.model.predict(tf.tensor2d([normalizedInput])) as tf.Tensor;
      const yieldValue = await prediction.data();
      
      // Apply state factor
      const stateFactor = this.stateFactors[inputData.state.toLowerCase()] || 1.0;
      const adjustedYield = yieldValue[0] * stateFactor;

      // Calculate confidence based on input quality
      const confidence = this.calculateConfidence(inputData);

      // Generate recommendations
      const recommendations = this.generateRecommendations(inputData, adjustedYield);

      // Calculate factor contributions
      const factors = this.calculateFactorContributions(inputData);

      // Clean up
      prediction.dispose();

      return {
        predictedYield: Math.round(Math.max(0, adjustedYield)),
        confidence,
        factors,
        recommendations
      };
    } catch (error) {
      console.error('Error making yield prediction:', error);
      throw error;
    }
  }

  private calculateConfidence(data: YieldInputData): number {
    let confidence = 70; // Base confidence

    // Area factor
    if (data.area > 0.5 && data.area < 100) confidence += 10;
    
    // Rainfall factor
    if (data.annualRainfall >= 600 && data.annualRainfall <= 1500) confidence += 10;
    
    // Fertilizer factor
    if (data.fertilizer >= 30 && data.fertilizer <= 200) confidence += 5;
    
    // Pesticides factor
    if (data.pesticides >= 2 && data.pesticides <= 20) confidence += 5;

    return Math.min(95, confidence);
  }

  private calculateFactorContributions(data: YieldInputData) {
    return {
      rainfall: this.getRainfallScore(data.annualRainfall),
      fertilizer: this.getFertilizerScore(data.fertilizer),
      pesticides: this.getPesticidesScore(data.pesticides),
      area: Math.min(100, (data.area / 10) * 20) // Area contribution score
    };
  }

  private getRainfallScore(rainfall: number): number {
    if (rainfall >= 600 && rainfall <= 1200) return 90;
    if (rainfall >= 400 && rainfall <= 1500) return 75;
    if (rainfall >= 300 && rainfall <= 1800) return 60;
    return 40;
  }

  private getFertilizerScore(fertilizer: number): number {
    if (fertilizer >= 50 && fertilizer <= 120) return 85;
    if (fertilizer >= 30 && fertilizer <= 150) return 70;
    if (fertilizer >= 20 && fertilizer <= 200) return 55;
    return 35;
  }

  private getPesticidesScore(pesticides: number): number {
    if (pesticides >= 5 && pesticides <= 12) return 80;
    if (pesticides >= 3 && pesticides <= 18) return 65;
    if (pesticides >= 1 && pesticides <= 25) return 50;
    return 30;
  }

  private generateRecommendations(data: YieldInputData, predictedYield: number): string[] {
    const recommendations: string[] = [];

    // Rainfall recommendations
    if (data.annualRainfall < 500) {
      recommendations.push("Consider irrigation systems due to low rainfall");
    } else if (data.annualRainfall > 2000) {
      recommendations.push("Ensure proper drainage to prevent waterlogging");
    }

    // Fertilizer recommendations
    if (data.fertilizer < 40) {
      recommendations.push("Increase fertilizer application for better yield");
    } else if (data.fertilizer > 200) {
      recommendations.push("Reduce fertilizer to prevent soil degradation");
    }

    // Pesticides recommendations
    if (data.pesticides < 3) {
      recommendations.push("Monitor for pests and apply pesticides as needed");
    } else if (data.pesticides > 20) {
      recommendations.push("Consider integrated pest management to reduce chemical usage");
    }

    // Yield-based recommendations
    if (predictedYield < 50) {
      recommendations.push("Consider soil testing and crop rotation for better yield");
    } else if (predictedYield > 200) {
      recommendations.push("Excellent conditions! Maintain current practices");
    }

    return recommendations;
  }

  isModelLoaded(): boolean {
    return this.isLoaded;
  }
}

export default YieldPredictionModel;