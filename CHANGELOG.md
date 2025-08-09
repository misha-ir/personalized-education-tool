# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

- Initial scaffolding for frontend and backend.
- Add root `.gitignore` for both apps.
- Setup backend with Express, TypeScript, and `/api/health` endpoint.
- Setup frontend with Vite, React, and Tailwind CSS.
- Add basic README.md and CHANGELOG.md.
- Create `.env.example` for backend configuration.

## [1.0.0] - 2025-08-09

### Added

- **Backend**
  - Express server with TypeScript and tsx watcher.
  - `/api/health` endpoint with env, server time, API version, and MongoDB connection status.
  - MongoDB connection via Mongoose.
  - Basic route file structure.
  - `.env.example` for environment variables.
- **Frontend**
  - Vite + React + Tailwind CSS scaffold.
  - `.env` support for API base URL.
- **Project Root**
  - Combined `.gitignore` for frontend and backend.
  - README.md with setup instructions.
  - CHANGELOG.md created following Keep a Changelog format.
