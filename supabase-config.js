// Initialize Supabase Client
const supabaseUrl = 'https://ltofqcuzutvvxincoptz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0b2ZxY3V6dXR2dnhpbmNvcHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY4MTUsImV4cCI6MjA1NTgxMjgxNX0.QyXKKGXP7pJe0xfFr64G53JlQ3B5AauwIx40ITjgOs8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Make supabaseClient available globally
window.supabaseClient = supabaseClient