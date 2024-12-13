// Repository Types
export interface RepoInfo {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  default_branch: string;
  html_url: string;
}

export interface RepoContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  type: 'file' | 'dir';
  content?: string;
  contents?: RepoContent[];
}

export interface RepoData extends RepoInfo {
  contents?: RepoContent[];
}

// API Response Types
export interface GitHubApiError {
  message: string;
  documentation_url?: string;
  status?: number;
}

// Service Response Types
export interface ServiceResponse<T> {
  data: T;
  error?: string;
} 