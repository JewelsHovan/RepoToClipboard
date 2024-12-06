import { useState } from 'react'
import './App.css'
import URLInput from './components/URLInput'
import axios from 'axios'
import RepoContents from './components/RepoContents'
import Footer from './components/Footer'

const MAX_DEPTH = 5; // Maximum directory depth
const MAX_FILES = 1000; // Maximum total files to fetch
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const axiosConfig = {
  headers: {
    'Accept': 'application/vnd.github.v3.raw',
    'Authorization': `token ${GITHUB_TOKEN}`
  }
};

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
      const repoResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        axiosConfig
      );
      
      // Function to fetch contents of a directory
      const fetchDirectoryContents = async (path: string = '') => {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          axiosConfig
        );
        return response.data;
      };

      // Function to fetch individual file contents
      const fetchFileContent = async (path: string) => {
        const fileResponse = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          axiosConfig
        );
        return fileResponse.data;
      };

      // Recursive function to process contents
      const processContents = async (path: string = '', depth: number = 0, fileCount: { current: number } = { current: 0 }): Promise<any[]> => {
        console.log(`Processing path: ${path} at depth: ${depth}, current file count: ${fileCount.current}`);
        
        if (depth >= MAX_DEPTH) {
          console.warn(`Maximum depth (${MAX_DEPTH}) reached at ${path}`);
          return [];
        }

        if (fileCount.current >= MAX_FILES) {
          console.warn(`Maximum file count (${MAX_FILES}) reached`);
          return [];
        }

        const items = await fetchDirectoryContents(path);
        console.log(`Found ${items.length} items in ${path || 'root'}:`, items);
        
        return Promise.all(
          items.map(async (item: any) => {
            console.log(`Processing item: ${item.path} (${item.type})`);
            
            if (fileCount.current >= MAX_FILES) return null;

            if (item.type === 'dir') {
              const subContents = await processContents(item.path, depth + 1, fileCount);
              return {
                ...item,
                contents: subContents
              };
            } else if (item.type === 'file') {
              fileCount.current += 1;
              const content = await fetchFileContent(item.path);
              console.log(`Fetched content for file: ${item.path}, content length: ${typeof content === 'string' ? content.length : 'binary'}`);
              return {
                ...item,
                content
              };
            }
            return item;
          })
        ).then(results => {
          const filteredResults = results.filter(Boolean);
          console.log(`Filtered results for ${path || 'root'}:`, filteredResults);
          return filteredResults;
        });
      };

      const processedContents = await processContents();
      console.log('Final processed contents:', JSON.stringify(processedContents, null, 2));

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text text-center break-words">
            GitHub Repo Copier
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base px-2">
            Copying an entire repo has never been easier, useful for context to pass to LLMs.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="max-w-xl mx-auto">
            <URLInput onFetchRepo={handleFetchRepo} isLoading={loading} />
          </div>
        </div>

        {/* Conditional rendering for repo data */}
        {repoData && (
          <div className="mt-6 bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold break-words">{repoData.full_name}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{repoData.description}</p>
              <div className="mt-4">
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Owner:</span> {repoData.owner.login}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Stars:</span> {repoData.stargazers_count}
                </p>
                <p className="text-sm sm:text-base">
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

      <Footer />
    </div>
  )
}

export default App
