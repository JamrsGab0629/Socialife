export default {
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './index.html',
        styles: './styles/global.css',
      }
    }
  },
  publicDir: '../public'
}
