import { useState } from 'react';
import { formatForMarkdown, formatForTxt, copyToClipboard, downloadAsFile } from '../utils/fileExport';

interface RepoContentsProps {
  contents: any[];
  repoName: string;
}

export default function RepoContents({ contents, repoName }: RepoContentsProps) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopyFile = async (content: string, path: string) => {
    try {
      await copyToClipboard(content);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportAll = (format: 'md' | 'txt') => {
    const formatter = format === 'md' ? formatForMarkdown : formatForTxt;
    const content = formatter(contents);
    downloadAsFile(content, repoName, format);
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Repository Contents</h3>
        <div className="space-x-2">
          <button
            onClick={() => handleExportAll('md')}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
          >
            Export as MD
          </button>
          <button
            onClick={() => handleExportAll('txt')}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
          >
            Export as TXT
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {Array.isArray(contents) && contents.map((item: any) => (
          <li key={item.path} className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600">{item.type === 'dir' ? '📁' : '📄'}</span>
                <span className="ml-2">{item.path}</span>
              </div>
              {item.type === 'file' && item.content && (
                <button
                  onClick={() => handleCopyFile(item.content, item.path)}
                  className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  {copiedPath === item.path ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {item.content && (
              <pre className="mt-2 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                {typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 