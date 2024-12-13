export const EXCLUDED_PATTERNS: RegExp[] = [
  // Dependencies and package management
  /node_modules/,
  /vendor/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  
  // Build outputs and compiled files
  /dist/,
  /build/,
  /out/,
  /\.next/,
  /\.nuxt/,
  
  // Binary and media files
  /\.(jpg|jpeg|png|gif|ico|svg|webp)$/i,
  /\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i,
  /\.(mp3|mp4|wav|avi|mov|webm)$/i,
  /\.(zip|tar|gz|rar|7z)$/i,

  // Data files
  /\.csv$/,
  /\.json$/,
  /\.h5$/,
  
  // IDE and editor files
  /\.idea/,
  /\.vscode/,
  /\.DS_Store$/,
  
  // Environment and local config files
  /\.env/,
  /\.env\..*/,
  
  // Large generated files
  /\.map$/,
  /\.min\.(js|css)$/,
  
  // Test coverage reports
  /coverage/,
  /\.nyc_output/,
  
  // Logs
  /\.log$/,
  /logs/,
  
  // Cache directories
  /\.cache/,
  /\.temp/,
  /\.tmp/
]; 