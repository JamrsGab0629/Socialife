export default {
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './src/index.html',
        styles: './src/styles/common.css'
      }
    }
  },
  publicDir: '../public'
}
