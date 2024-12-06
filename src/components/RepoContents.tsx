import { useState } from 'react';
import { formatForMarkdown, formatForTxt, copyToClipboard, downloadAsFile } from '../utils/fileExport';

interface RepoContentsProps {
  contents: any[];
  repoName: string;
}

// Add this new component for recursive rendering
const FileTreeItem = ({ item, onCopyFile, copiedPath }: {
  item: any;
  onCopyFile: (content: string, path: string) => void;
  copiedPath: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="flex flex-col">
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-all duration-200">
        <div className="flex items-center">
          {item.type === 'dir' && (
            <button onClick={toggleExpand} className="mr-2 text-gray-600 hover:text-primary transition-colors">
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          <span className="text-gray-600">{item.type === 'dir' ? '📁' : '📄'}</span>
          <span className="ml-2 text-gray-700">{item.path}</span>
        </div>
        {item.type === 'file' && item.content && (
          <button
            onClick={() => onCopyFile(item.content, item.path)}
            className="px-3 py-1.5 text-sm bg-white rounded-md hover:bg-gray-50 
                     shadow-sm hover:shadow transition-all duration-200 text-gray-700"
          >
            {copiedPath === item.path ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      
      {/* File content with enhanced styling */}
      {item.type === 'file' && item.content && (
        <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-sm overflow-x-auto
                      shadow-inner border border-gray-100">
          {typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)}
        </pre>
      )}
      
      {/* Recursively render directory contents if expanded */}
      {item.type === 'dir' && isExpanded && item.contents && (
        <ul className="ml-6 mt-2 space-y-2">
          {item.contents.map((subItem: any) => (
            <FileTreeItem
              key={subItem.path}
              item={subItem}
              onCopyFile={onCopyFile}
              copiedPath={copiedPath}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

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

  const handleCopyAll = async () => {
    try {
      const formattedContent = formatForTxt(contents);
      await copyToClipboard(formattedContent);
      setCopiedPath('all');
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error('Failed to copy all contents:', err);
    }
  };

  const handleExportAll = (format: 'md' | 'txt') => {
    const formatter = format === 'md' ? formatForMarkdown : formatForTxt;
    const content = formatter(contents);
    downloadAsFile(content, repoName, format);
  };

  return (
    <div className="mt-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Repository Contents</h3>
        <div className="space-x-3">
          <button
            onClick={handleCopyAll}
            className="px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner"
          >
            {copiedPath === 'all' ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={() => handleExportAll('md')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner"
          >
            Export as MD
          </button>
          <button
            onClick={() => handleExportAll('txt')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner"
          >
            Export as TXT
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {Array.isArray(contents) && contents.map((item: any) => (
          <FileTreeItem
            key={item.path}
            item={item}
            onCopyFile={handleCopyFile}
            copiedPath={copiedPath}
          />
        ))}
      </ul>
    </div>
  );
} 