export interface LoginRequest {
email: string;
password: string;
rememberMe?: boolean;
}


export interface LoginResponse {
accessToken: string;
refreshToken?: string;
expiresIn?: number; 
user?: any; 
}