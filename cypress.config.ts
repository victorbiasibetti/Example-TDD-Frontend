import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '2s7y55',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'src/main/test/cypress/integration/**/*.spec.ts',
    
    baseUrl: 'http://localhost:8080',
    supportFile: false,
  },
  chromeWebSecurity:false,  
  fixturesFolder: 'src/main/test/cypress/fixtures',  
});
