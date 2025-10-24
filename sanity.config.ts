import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

console.log("Sanity config loading...");

export default defineConfig({
  name: 'default',
  title: 'Al Marsam',
  projectId: 'xxxx',
  console.log(`projectId: xxxx`),
  
  dataset: 'production',
  console.log(`dataset: production`),
  plugins: [structureTool()],
  schema: {
    types: [],
  },
  
})
