// Temporary script to clear auth and force re-login
// Run this in browser console: localStorage.clear(); window.location.reload();

console.log('=== AUTH DEBUG ===');
console.log('Current user:', JSON.parse(localStorage.getItem('auth-storage') || '{}'));
console.log('\nTo fix admin access:');
console.log('1. Run: localStorage.clear()');
console.log('2. Refresh page');
console.log('3. Log in again with: ekajjamalcolm@gmail.com');
