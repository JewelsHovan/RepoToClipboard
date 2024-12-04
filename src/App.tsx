import { useState } from 'react'
import './App.css'
import URLInput from './components/URLInput'
import axios from 'axios'

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
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      setRepoData({
        ...repoResponse.data,
        contents: contentsResponse.data
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
          <h1 className="text-3xl font-bold text-text">
            GitHub Repo Copier
          </h1>
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
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Repository Contents</h3>
            <ul className="space-y-2">
              {Array.isArray(repoData.contents) && repoData.contents.map((item: any) => (
                <li key={item.path} className="flex items-center">
                  <span className="text-gray-600">{item.type === 'dir' ? '📁' : '📄'}</span>
                  <span className="ml-2">{item.path}</span>
                </li>
              ))}
            </ul>
          </div>
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
