// dashboard overview page   

export interface AgeDistribution {
  "18-24": number;
  "25-34": number;
  "35-44": number;
  "45-54": number;
  "55+": number;
  "Unknown": number;
}

export interface AgeDistributionResponse {
  success: boolean;
  message: string;
  data: AgeDistribution;
}
