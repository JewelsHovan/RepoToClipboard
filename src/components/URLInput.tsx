import { useState } from 'react';

interface URLInputProps {
  onFetchRepo: (url: string) => Promise<void>;
  isLoading?: boolean;
}

const URLInput = ({ onFetchRepo, isLoading = false }: URLInputProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    await onFetchRepo(url.trim());
  };

  const isValidGithubUrl = (url: string) => {
    return /^https:\/\/github\.com\/[\w-]+\/[\w-]+/.test(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="repo-url" className="block text-sm font-medium text-text">
          GitHub Repository URL
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="url"
            name="repo-url"
            id="repo-url"
            className="input flex-1"
            placeholder="https://github.com/owner/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-primary ml-4"
            disabled={isLoading || !isValidGithubUrl(url)}
          >
            {isLoading ? 'Fetching...' : 'Fetch Repo'}
          </button>
        </div>
      </div>
      {url && !isValidGithubUrl(url) && (
        <p className="text-error text-sm">
          Please enter a valid GitHub repository URL
        </p>
      )}
    </form>
  );
};

export default URLInput; 