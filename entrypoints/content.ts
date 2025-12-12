export default defineContentScript({
  matches: ['*://*/*', 'http://localhost:4000'],
  main() {
    console.log('Hello content.');
  },
});
