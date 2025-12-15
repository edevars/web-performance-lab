// Simulate a blocking script that runs before the page renders
console.log('Blocking script started');
const start = Date.now();
while (Date.now() - start < 2000) {
    // Block main thread for 2 seconds
}
console.log('Blocking script finished');
