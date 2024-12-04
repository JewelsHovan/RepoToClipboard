import { useState } from 'react'
import './App.css'
import URLInput from './components/URLInput'
import axios from 'axios'
import RepoContents from './components/RepoContents'

function App() {
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRepo = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      // Extract owner and repo from GitHub URL
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }
      const [, owner, repo] = match;

      // Fetch repo data from GitHub API
      const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      
      // Fetch repo contents from GitHub API
      const contentsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents`, 
        {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        }
      );

      // Function to fetch individual file contents
      const fetchFileContent = async (path: string) => {
        const fileResponse = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3.raw'
            }
          }
        );
        return fileResponse.data;
      };

      // Process directory contents and fetch file contents
      const processContents = async (items: any[]) => {
        return Promise.all(items.map(async (item) => {
          if (item.type === 'file') {
            const content = await fetchFileContent(item.path);
            return { ...item, content };
          }
          return item;
        }));
      };

      const processedContents = await processContents(contentsResponse.data);

      setRepoData({
        ...repoResponse.data,
        contents: processedContents
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repository');
      setRepoData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text text-center">
            GitHub Repo Copier
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Copying an entire repo has never been easier, useful for context to pass to LLMs.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="max-w-xl mx-auto">
            <URLInput onFetchRepo={handleFetchRepo} isLoading={loading} />
          </div>
        </div>

        {/* Conditional rendering for repo data */}
        {repoData && (
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold">{repoData.full_name}</h2>
              <p className="text-gray-600">{repoData.description}</p>
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Owner:</span> {repoData.owner.login}
                </p>
                <p>
                  <span className="font-semibold">Stars:</span> {repoData.stargazers_count}
                </p>
                <p>
                  <span className="font-semibold">Default Branch:</span> {repoData.default_branch}
                </p>
              </div>
            </div>
          </div>
        )}

        {repoData?.contents && (
          <RepoContents 
            contents={repoData.contents} 
            repoName={repoData.full_name} 
          />
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error text-error rounded-md">
            {error}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
