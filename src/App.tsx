import { useRef } from 'react'
import './App.css'
import URLInput from './components/URLInput'
import RepoContents from './components/RepoContents'
import Footer from './components/Footer'
import TreeVisualization from './components/TreeVisualization'
import { useGitHubRepo } from './hooks/useGitHubRepo'

function App() {
  const { repoData, loading, error, fetchRepo } = useGitHubRepo()
  const repoContentsRef = useRef<any>(null)

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
            <URLInput onFetchRepo={fetchRepo} isLoading={loading} />
          </div>
        </div>

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
          <>
            <TreeVisualization 
              contents={repoData.contents} 
              repoName={repoData.full_name}
              onNodeClick={(path: string) => {
                if (repoContentsRef.current) {
                  repoContentsRef.current.scrollToContent(path)
                }
              }}
            />
            <RepoContents 
              contents={repoData.contents} 
              repoName={repoData.full_name}
              ref={repoContentsRef}
            />
          </>
        )}

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
