const SUPABASE_URL = 'https://ltofqcuzutvvxincoptz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0b2ZxY3V6dXR2dnhpbmNvcHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzY4MTUsImV4cCI6MjA1NTgxMjgxNX0.QyXKKGXP7pJe0xfFr64G53JlQ3B5AauwIx40ITjgOs8'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { user, error } = await supabase.auth.signIn({
            email,
            password,
        });

        if (error) throw error;
        
        // Redirect to dashboard on success
        window.location.href = '../dashboard/home.html';
    } catch (error) {
        alert(error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    // Similar to login but with supabase.auth.signUp
}

