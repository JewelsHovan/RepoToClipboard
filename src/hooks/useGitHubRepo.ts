import { useState, useCallback } from 'react';
import { GitHubService } from '../services/github';
import { RepoData } from '../types/github';

interface UseGitHubRepo {
  repoData: RepoData | null;
  loading: boolean;
  error: string | null;
  fetchRepo: (url: string) => Promise<void>;
  clearRepo: () => void;
}

export const useGitHubRepo = (): UseGitHubRepo => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearRepo = useCallback(() => {
    setRepoData(null);
    setError(null);
  }, []);

  const extractRepoInfo = (url: string): { owner: string; repo: string } => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }
    const [, owner, repo] = match;
    return { owner, repo };
  };

  const fetchRepo = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { owner, repo } = extractRepoInfo(url);
      const githubService = new GitHubService(owner, repo);
      const repoData = await githubService.getRepositoryContents();
      setRepoData(repoData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repository';
      setError(errorMessage);
      setRepoData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    repoData,
    loading,
    error,
    fetchRepo,
    clearRepo
  };
}; 