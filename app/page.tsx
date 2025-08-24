// app/page.tsx
import MarkdownViewer from "@/components/markdown/MarkdownViewer";

const sampleMarkdown = `
# Welcome to Advanced Markdown Viewer

This is a demonstration of the **Next.js 15** Markdown viewer with advanced features.

## Features Overview

### 🎨 Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> A
    C --> E[End]
\`\`\`

### 🗺️ Markmap Mind Maps

\`\`\`markmap
# Central Idea
## Branch 1
### Sub-branch 1.1
### Sub-branch 1.2
## Branch 2
### Sub-branch 2.1
### Sub-branch 2.2
## Branch 3
### Sub-branch 3.1
### Sub-branch 3.2
\`\`\`

### 🔗 External Links

Check out [Next.js Documentation](https://nextjs.org/docs) - it opens in a new tab!

### 📸 Interactive Images

![Beautiful landscape with mountains and lake](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

### 📊 Tables Support

| Feature | Status | Notes |
|---------|--------|-------|
| Mermaid | ✅ | Fully supported |
| Markmap | ✅ | Interactive mind maps |
| Images | ✅ | Click to fullscreen |
| Links | ✅ | External links open in new tab |

### 💻 Code Blocks

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const greeting = (user: User): string => {
  return \`Hello, \${user.name}!\`;
};
\`\`\`

### 📝 Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

### ✅ Task Lists

- [x] Implement Markdown viewer
- [x] Add Mermaid support
- [x] Add Markmap support
- [x] Implement image viewer
- [ ] Add more features

---

## Getting Started

1. Install dependencies
2. Configure your markdown content
3. Customize styles as needed
4. Deploy to production

Enjoy your enhanced Markdown viewing experience! 🚀
`;

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <MarkdownViewer content={sampleMarkdown} />
      </div>
    </main>
  );
}