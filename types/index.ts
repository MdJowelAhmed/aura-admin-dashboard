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


export interface EthnicityDistributionResponse {
  success: boolean;
  message: string;
  data: {
    "Black / Africa Decent": number;
    "East Asia": number;
    "Hispanic/Latino": number;
    "Middle Eastern": number;
    "Native American": number;
    "Pacific Islander": number;
    "South Asian": number;
    "Southeast Asian": number;
    "White Caucasion": number;
    "Other": number;
    "Open to All": number;
    "Pisces": number;
    "Unknown": number;
  };
}

export interface GenderDistribution {
  success: boolean;
  message: string;
  data: {
    MAN: {
      total: number;
      percentage: string;
    };
    WOMEN: {
      total: number;
      percentage: string;
    };
    "NON-BINARY": {
      total: number;
      percentage: string;
    };
    "TRANS MAN": {
      total: number;
      percentage: string;
    };
    "TRANS WOMAN": {
      total: number;
      percentage: string;
    };
    Unknown: {
      total: number;
      percentage: string;
    };
  };
}

