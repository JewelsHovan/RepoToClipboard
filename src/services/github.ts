import axios from 'axios';
import { 
  GITHUB_TOKEN, 
  MAX_DEPTH, 
  MAX_FILES, 
  GITHUB_API_BASE,
  API_HEADERS 
} from '../config/constants';
import { EXCLUDED_PATTERNS } from '../config/excludePatterns';

// Types for better type safety
interface GithubApiConfig {
  headers: {
    Accept: string;
    Authorization: string;
  };
}

interface FileCount {
  current: number;
}

export class GitHubService {
  private readonly axiosConfig: GithubApiConfig;
  private owner: string;
  private repo: string;
  private readonly MAX_DEPTH = MAX_DEPTH;
  private readonly MAX_FILES = MAX_FILES;

  constructor(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
    this.axiosConfig = {
      headers: API_HEADERS
    };
  }

  async getRepoInfo() {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getRepositoryContents() {
    try {
      const repoInfo = await this.getRepoInfo();
      const processedContents = await this.processContents();
      
      return {
        ...repoInfo,
        contents: processedContents
      };
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private async fetchDirectoryContents(path: string = '') {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private async fetchFileContent(path: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private async processContents(path: string = '', depth: number = 0, fileCount: FileCount = { current: 0 }): Promise<any[]> {
    if (depth >= this.MAX_DEPTH) {
      console.warn(`Maximum depth (${this.MAX_DEPTH}) reached at ${path}`);
      return [];
    }

    if (fileCount.current >= this.MAX_FILES) {
      console.warn(`Maximum file count (${this.MAX_FILES}) reached`);
      return [];
    }

    const items = await this.fetchDirectoryContents(path);
    
    const filteredItems = this.filterExcludedItems(items);
    
    return Promise.all(
      filteredItems.map(async (item: any) => {
        if (fileCount.current >= this.MAX_FILES) return null;

        if (item.type === 'dir') {
          const subContents = await this.processContents(item.path, depth + 1, fileCount);
          return {
            ...item,
            contents: subContents
          };
        } else if (item.type === 'file') {
          fileCount.current += 1;
          const content = await this.fetchFileContent(item.path);
          return {
            ...item,
            content
          };
        }
        return item;
      })
    ).then(results => results.filter(Boolean));
  }

  private filterExcludedItems(items: any[]) {
    return items.filter((item: any) => {
      const shouldExclude = this.getExcludedPatterns().some(pattern => 
        pattern.test(item.path) || pattern.test(item.name)
      );
      if (shouldExclude) {
        console.log(`Skipping excluded item: ${item.path}`);
      }
      return !shouldExclude;
    });
  }

  private getExcludedPatterns(): RegExp[] {
    return EXCLUDED_PATTERNS;
  }

  private handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Repository or resource not found');
      }
      if (error.response?.status === 403) {
        throw new Error('API rate limit exceeded or authentication required');
      }
    }
    throw new Error('Failed to fetch repository data');
  }
} 