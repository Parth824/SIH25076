import * as tf from '@tensorflow/tfjs';

export interface CropInputData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropPrediction {
  crop: string;
  confidence: number;
  suitabilityScore: number;
}

class CropRecommendationModel {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;
  
  // Crop labels mapping
  private cropLabels = [
    'Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas',
    'Mothbeans', 'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate',
    'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon',
    'Apple', 'Orange', 'Papaya', 'Coconut', 'Cotton',
    'Jute', 'Coffee'
  ];

  // Feature normalization parameters (based on typical agricultural data ranges)
  private normalizationParams = {
    nitrogen: { min: 0, max: 140 },
    phosphorus: { min: 5, max: 145 },
    potassium: { min: 5, max: 205 },
    temperature: { min: 8, max: 44 },
    humidity: { min: 14, max: 100 },
    ph: { min: 3.5, max: 10 },
    rainfall: { min: 20, max: 300 }
  };

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Create a simple neural network model for crop recommendation
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [7], // 7 input features
            units: 128,
            activation: 'relu',
            kernelInitializer: 'randomNormal'
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({
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
          tf.layers.dense({
            units: this.cropLabels.length,
            activation: 'softmax'
          })
        ]
      });

      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // Initialize with some pre-trained weights simulation
      await this.simulateTraining();
      
      this.isLoaded = true;
      console.log('Crop recommendation model loaded successfully');
    } catch (error) {
      console.error('Error initializing crop recommendation model:', error);
    }
  }

  private async simulateTraining() {
    // Generate synthetic training data for demonstration
    const batchSize = 100;
    const epochs = 5;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const { inputs, labels } = this.generateSyntheticData(batchSize);
      
      await this.model!.fit(inputs, labels, {
        epochs: 1,
        verbose: 0,
        shuffle: true
      });
    }
  }

  private generateSyntheticData(batchSize: number) {
    const inputs: number[][] = [];
    const labels: number[][] = [];

    for (let i = 0; i < batchSize; i++) {
      // Generate realistic agricultural data
      const sample = this.generateRealisticSample();
      const cropIndex = this.determineBestCrop(sample);
      
      inputs.push([
        sample.nitrogen,
        sample.phosphorus,
        sample.potassium,
        sample.temperature,
        sample.humidity,
        sample.ph,
        sample.rainfall
      ]);

      // One-hot encode the label
      const label = new Array(this.cropLabels.length).fill(0);
      label[cropIndex] = 1;
      labels.push(label);
    }

    return {
      inputs: tf.tensor2d(inputs),
      labels: tf.tensor2d(labels)
    };
  }

  private generateRealisticSample(): CropInputData {
    return {
      nitrogen: Math.random() * 140,
      phosphorus: Math.random() * 140 + 5,
      potassium: Math.random() * 200 + 5,
      temperature: Math.random() * 36 + 8,
      humidity: Math.random() * 86 + 14,
      ph: Math.random() * 6.5 + 3.5,
      rainfall: Math.random() * 280 + 20
    };
  }

  private determineBestCrop(data: CropInputData): number {
    // Rule-based logic to determine best crop for synthetic data generation
    if (data.rainfall > 200 && data.temperature > 25 && data.humidity > 70) {
      return 0; // Rice
    } else if (data.temperature > 20 && data.temperature < 30 && data.ph > 6 && data.ph < 7.5) {
      return 1; // Maize
    } else if (data.ph > 6 && data.rainfall < 100) {
      return 2; // Chickpea
    } else if (data.temperature > 25 && data.humidity > 60) {
      return 19; // Cotton
    } else if (data.temperature > 15 && data.rainfall > 150) {
      return 21; // Coffee
    }
    
    return Math.floor(Math.random() * this.cropLabels.length);
  }

  private normalizeInput(data: CropInputData): number[] {
    return [
      (data.nitrogen - this.normalizationParams.nitrogen.min) / 
      (this.normalizationParams.nitrogen.max - this.normalizationParams.nitrogen.min),
      
      (data.phosphorus - this.normalizationParams.phosphorus.min) / 
      (this.normalizationParams.phosphorus.max - this.normalizationParams.phosphorus.min),
      
      (data.potassium - this.normalizationParams.potassium.min) / 
      (this.normalizationParams.potassium.max - this.normalizationParams.potassium.min),
      
      (data.temperature - this.normalizationParams.temperature.min) / 
      (this.normalizationParams.temperature.max - this.normalizationParams.temperature.min),
      
      (data.humidity - this.normalizationParams.humidity.min) / 
      (this.normalizationParams.humidity.max - this.normalizationParams.humidity.min),
      
      (data.ph - this.normalizationParams.ph.min) / 
      (this.normalizationParams.ph.max - this.normalizationParams.ph.min),
      
      (data.rainfall - this.normalizationParams.rainfall.min) / 
      (this.normalizationParams.rainfall.max - this.normalizationParams.rainfall.min)
    ];
  }

  async predict(inputData: CropInputData): Promise<CropPrediction[]> {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded yet');
    }

    try {
      // Normalize input data
      const normalizedInput = this.normalizeInput(inputData);
      
      // Make prediction
      const prediction = this.model.predict(tf.tensor2d([normalizedInput])) as tf.Tensor;
      const probabilities = await prediction.data();
      
      // Get top 3 predictions
      const predictions: CropPrediction[] = [];
      const sortedIndices = Array.from(probabilities)
        .map((prob, index) => ({ prob, index }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 3);

      for (const { prob, index } of sortedIndices) {
        predictions.push({
          crop: this.cropLabels[index],
          confidence: prob * 100,
          suitabilityScore: this.calculateSuitabilityScore(inputData, this.cropLabels[index])
        });
      }

      // Clean up tensors
      prediction.dispose();

      return predictions;
    } catch (error) {
      console.error('Error making crop prediction:', error);
      throw error;
    }
  }

  private calculateSuitabilityScore(data: CropInputData, crop: string): number {
    // Calculate suitability score based on crop-specific requirements
    let score = 50; // Base score

    switch (crop.toLowerCase()) {
      case 'rice':
        if (data.rainfall > 150) score += 20;
        if (data.temperature > 20 && data.temperature < 35) score += 15;
        if (data.humidity > 70) score += 15;
        break;
      case 'wheat':
        if (data.temperature > 15 && data.temperature < 25) score += 20;
        if (data.ph > 6 && data.ph < 7.5) score += 15;
        if (data.rainfall > 50 && data.rainfall < 150) score += 15;
        break;
      case 'cotton':
        if (data.temperature > 25) score += 20;
        if (data.humidity > 60) score += 15;
        if (data.potassium > 100) score += 15;
        break;
      default:
        score += Math.random() * 30; // Random score for other crops
    }

    return Math.min(100, Math.max(0, score));
  }

  isModelLoaded(): boolean {
    return this.isLoaded;
  }
}

export default CropRecommendationModel;