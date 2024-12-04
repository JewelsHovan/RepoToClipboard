# GitHub Repo Copier

A modern web application that allows users to fetch and copy GitHub repository contents easily. Built with React, TypeScript, and Vite.

## Features

- Clean, modern UI built with Tailwind CSS
- Real-time GitHub repository URL validation
- Fetch repository details using GitHub's REST API
- Display repository information including:
  - Repository name and description
  - Owner information
  - Star count
  - Default branch
- View repository contents:
  - File and directory structure
  - Raw file contents
  - Visual indicators for files and folders

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **API**: GitHub REST API v3

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
cd github-repo-copier
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── URLInput.tsx     # Component for GitHub URL input and validation
├── App.tsx             # Main application component
├── App.css            # Custom CSS styles
└── index.css          # Global styles and Tailwind directives
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Styling

The project uses Tailwind CSS with a custom configuration including:

- Custom color scheme:
  - Primary: Blue (#3B82F6)
  - Background: White (#FFFFFF)
  - Text: Dark Gray (#1F2937)
  - Success: Green (#10B981)
  - Error: Red (#EF4444)
- Custom component classes for buttons and inputs
- Responsive design patterns

## API Usage

The application uses the following GitHub API endpoints:

- `/repos/{owner}/{repo}` - Fetch repository metadata
- `/repos/{owner}/{repo}/contents` - Fetch repository contents
- `/repos/{owner}/{repo}/contents/{path}` - Fetch specific file contents

Note: GitHub API has rate limiting:
- 60 requests per hour for unauthenticated requests
- 5,000 requests per hour with authentication

## Future Enhancements

- Branch/Tag selection functionality
- Directory tree viewer with expandable folders
- Recursive directory content fetching
- File content copying
- Download as Text/Markdown option
- GitHub OAuth integration for:
  - Private repository access
  - Increased API rate limits
- Caching mechanism for API responses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your chosen license]

// ... existing ESLint configuration section ...
