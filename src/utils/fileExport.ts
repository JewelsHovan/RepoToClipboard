interface FileData {
  path: string;
  type: string;
  content?: string;
  contents?: FileData[];
}

export const formatForMarkdown = (files: FileData[]): string => {
  return files.map(file => {
    if (file.type === 'file' && file.content) {
      return `## ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n`;
    } else if (file.type === 'dir' && file.contents) {
      return `### ${file.path}\n${formatForMarkdown(file.contents)}`;
    }
    return '';
  }).join('\n');
};

export const formatForTxt = (files: FileData[]): string => {
  return files.map(file => {
    if (file.type === 'file' && file.content) {
      return `=== ${file.path} ===\n${file.content}\n\n`;
    } else if (file.type === 'dir' && file.contents) {
      return `--- ${file.path} ---\n${formatForTxt(file.contents)}`;
    }
    return '';
  }).join('\n');
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    throw new Error('Failed to copy to clipboard');
  }
};

export const downloadAsFile = (content: string, filename: string, format: 'md' | 'txt'): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 