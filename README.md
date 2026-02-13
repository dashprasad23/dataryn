# Dataryn

Dataryn is a modern, cross-platform database management tool built with [Tauri](https://tauri.app/), [React](https://reactjs.org/), and [TypeScript](https://www.typescriptlang.org/). It provides a sleek and efficient interface for managing database connections, starting with MongoDB support.

## Features

- **Connection Management**: Easily add, save, and manage database connections.
- **MongoDB Support**: Connect to MongoDB instances using the official Rust driver for optimal performance.
- **Modern UI**: Designed with the Salesforce Lightning Design System (SLDS) for a clean, professional user experience.
- **High Performance**: Built on Rust and Tauri for a lightweight, secure, and fast application.

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- SCSS / SLDS
- React Router

**Backend:**
- Rust
- Tauri v2
- MongoDB Driver (Rust)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Rust & Cargo](https://www.rust-lang.org/tools/install)
- [Tauri CLI Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) (OS-specific dependencies)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dataryn.git
   cd dataryn
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run tauri dev
   ```

### Building for Production

To build the application for your operating system:

```bash
npm run tauri build
```

The build artifacts will be located in `src-tauri/target/release/bundle`.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
