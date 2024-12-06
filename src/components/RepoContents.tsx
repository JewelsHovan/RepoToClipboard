import { useState, useEffect, forwardRef, ForwardedRef } from 'react';
import { formatForMarkdown, formatForTxt, copyToClipboard, downloadAsFile } from '../utils/fileExport';

interface RepoContentsProps {
  contents: any[];
  repoName: string;
  onScrollToContent?: (scrollHandler: (path: string) => void) => void;
}

const RepoContents = forwardRef(({ contents, repoName, onScrollToContent }: RepoContentsProps, ref: ForwardedRef<any>) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = {
        scrollToContent,
        expandPath
      };
    }
  }, [ref]);

  const expandPath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    const parts = path.split('/');
    for (let i = 1; i <= parts.length; i++) {
      const parentPath = parts.slice(0, i).join('/');
      newExpanded.add(parentPath);
    }
    setExpandedPaths(newExpanded);
  };

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

  const scrollToContent = (path: string) => {
    expandPath(path);
    const element = document.getElementById(`content-${path}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (onScrollToContent) {
      onScrollToContent(scrollToContent);
    }
  }, [onScrollToContent]);

  const FileTreeItem = ({ item, onCopyFile, copiedPath }: {
    item: any;
    onCopyFile: (content: string, path: string) => void;
    copiedPath: string | null;
  }) => {
    const isExpanded = expandedPaths.has(item.path);

    return (
      <li id={`content-${item.path}`} className="flex flex-col w-full">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-all duration-200 w-full overflow-hidden">
          <div className="flex items-center min-w-0 flex-1 overflow-hidden">
            {item.type === 'dir' && (
              <button 
                onClick={() => {
                  const newExpanded = new Set(expandedPaths);
                  if (isExpanded) {
                    newExpanded.delete(item.path);
                  } else {
                    newExpanded.add(item.path);
                  }
                  setExpandedPaths(newExpanded);
                }} 
                className="mr-2 text-gray-600 hover:text-primary transition-colors flex-shrink-0"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            <span className="text-gray-600 flex-shrink-0">{item.type === 'dir' ? '📁' : '📄'}</span>
            <span className="ml-2 text-gray-700 truncate max-w-[200px] sm:max-w-[400px]">{item.path}</span>
          </div>
          {item.type === 'file' && item.content && (
            <button
              onClick={() => onCopyFile(item.content, item.path)}
              className="px-3 py-1.5 text-sm bg-white rounded-md hover:bg-gray-50 
                       shadow-sm hover:shadow transition-all duration-200 text-gray-700 ml-2 flex-shrink-0"
            >
              {copiedPath === item.path ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        
        {item.type === 'file' && item.content && (
          <div className="mt-2 relative w-full">
            <div className="overflow-x-auto">
              <pre className="p-4 bg-gray-50 rounded-lg text-sm
                           shadow-inner border border-gray-100 max-w-full">
                <code className="break-words whitespace-pre-wrap text-xs sm:text-sm">
                  {typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        )}
        
        {item.type === 'dir' && isExpanded && item.contents && (
          <ul className="ml-4 sm:ml-6 mt-2 space-y-2 w-full">
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

  return (
    <div className="mt-6 bg-white rounded-xl p-2 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Repository Contents</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleCopyAll}
            className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner w-full sm:w-auto text-sm"
          >
            {copiedPath === 'all' ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={() => handleExportAll('md')}
            className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner w-full sm:w-auto text-sm"
          >
            Export as MD
          </button>
          <button
            onClick={() => handleExportAll('txt')}
            className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:shadow-md
                     transition-all duration-200 hover:bg-primary/90 active:shadow-inner w-full sm:w-auto text-sm"
          >
            Export as TXT
          </button>
        </div>
      </div>
      
      <ul className="space-y-2 w-full">
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
});

export default RepoContents; 