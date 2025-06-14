import { createReactApp } from './create/index.js';

// To do
// Run create react vite and generate the project structure
// Cleanup files which we feel should not be there
// Add dependencies for react routing
// Setup layout configuration
// Include internationalization support
// Enable configuration to manage configuration driven content for static content.
// Include assets folders and proxies to connect with api's
// Include API hooks to connect with backend services
// Add redux toolkit for state management
// Include Angular Material for UI components
// Include support for theming and dark mode
// Add support for testing using vitest
// Include support for linting using biome.js
// Add docker files for containerization
// Include prism mocks to emulate the backend services
export const createApp = (appTargetDirectory: string, name: string): void => {
  createReactApp(appTargetDirectory, name);
};
