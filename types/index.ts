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




// user management page 

interface User {
  location: {
    type: string;
    coordinates: [number, number];
  };
  accountInformation: {
    status: boolean;
  };
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string | null;
  email: string;
  profile: string | null;
  documentVerified: string[] | null;
  photo: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  verified: boolean;
  status: string;
  userReport: string;
  stripeAccountId: string | null;
  myInterested: string[];
  drinking: boolean;
  marijuana: boolean;
  smoking: boolean;
  gender: string;
  children: boolean;
  politics: string;
  educationLevel: string;
  balance: number;
  availableTime: number;
  lastActive: string; // ISO date string
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  age?: number;
  maxAge?: number;
  minAge?: number;
  height?: number;
}

interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

interface UsersData {
  pagination: Pagination;
  data: User[];
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UsersData;
}


