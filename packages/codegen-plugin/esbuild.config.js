const esbuild = require('esbuild');
const path = require('path');

// Build the extension bundle
esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outfile: 'out/extension.js',
  external: [
    'vscode' // VS Code API is provided at runtime
  ],
  resolveExtensions: ['.ts', '.js'],
  sourcemap: true,
  format: 'cjs',
  minify: false,
  metafile: true,
  logLevel: 'info',
  // Add this to find modules in the monorepo
  plugins: [
    {
      name: 'monorepo-resolver',
      setup(build) {
        // When importing from @app-gen-cli/generators or relative paths
        build.onResolve({ filter: /^(@app-gen-cli\/generators|\.\.\/\.\.\/libs\/generators)/ }, args => {
          // Map to the actual path in the monorepo with specific index.ts file
          const generatorsPath = path.resolve(__dirname, '../../libs/generators/index.ts');
          return { path: generatorsPath };
        });
        
        // For shared utilities
        build.onResolve({ filter: /^@app-gen-cli\/shared/ }, args => {
          const sharedPath = path.resolve(__dirname, '../../libs/shared/index.ts');
          return { path: sharedPath };
        });
      }
    }
  ]
}).then(result => {
  console.log('Extension build complete!');
  
  // You can log the metafile to analyze the bundle
  if (result.metafile) {
    const outputs = Object.keys(result.metafile.outputs);
    console.log(`Generated output files: ${outputs.join(', ')}`);
  }
}).catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
