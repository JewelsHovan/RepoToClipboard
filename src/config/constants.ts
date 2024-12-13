// API Configuration
export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Repository Limits
export const MAX_DEPTH = 5;
export const MAX_FILES = 1000;

// API Endpoints
export const GITHUB_API_BASE = 'https://api.github.com';

// API Headers
export const API_HEADERS = {
  'Accept': 'application/vnd.github.v3.raw',
  'Authorization': `token ${GITHUB_TOKEN}`
}; 