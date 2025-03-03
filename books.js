let currentPage = 1;
const booksPerPage = 12;
let totalBooks = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', () => {
        currentPage = 1;
        loadBooks();
    });

    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentPage = 1;
            loadBooks();
        }
    });

    // Filter and sort functionality
    document.getElementById('genreFilter').addEventListener('change', () => {
        currentPage = 1;
        loadBooks();
    });

    document.getElementById('sortBy').addEventListener('change', () => {
        currentPage = 1;
        loadBooks();
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBooks();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage * booksPerPage < totalBooks) {
            currentPage++;
            loadBooks();
        }
    });
}

async function loadBooks() {
    try {
        const searchTerm = document.getElementById('searchInput').value;
        const genre = document.getElementById('genreFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        let query = window.supabaseClient
            .from('books')
            .select(`
                *,
                publisher:publisher_id (
                    full_name
                )
            `, { count: 'exact' });

        // Apply search filter
        if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
        }

        // Apply genre filter
        if (genre) {
            query = query.eq('genre', genre);
        }

        // Apply sorting
        switch (sortBy) {
            case 'title':
                query = query.order('title');
                break;
            case 'price-asc':
                query = query.order('price');
                break;
            case 'price-desc':
                query = query.order('price', { ascending: false });
                break;
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
        }

        // Apply pagination
        const start = (currentPage - 1) * booksPerPage;
        query = query.range(start, start + booksPerPage - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        totalBooks = count;
        updateBooksGrid(data);
        updatePagination();

    } catch (error) {
        console.error('Error loading books:', error);
    }
}

function updateBooksGrid(books) {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = books.map(book => `
        <div class="book-card" onclick="navigateToBookDetails('${book.id}')">
            <img src="${book.cover_image_url || 'assets/images/default-book-cover.png'}"
                alt="${book.title}"
                onerror="this.src='assets/images/default-book-cover.png'">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">By ${book.author}</p>
                <p class="publisher">Published by ${book.publisher?.full_name || 'Unknown'}</p>
                ${book.is_free
                    ? '<p class="price free">Free</p>'
                    : `<p class="price">$${book.price.toFixed(2)}</p>`
                }
                <button 
                    onclick="navigateToBookDetails('${book.id}')"
                    class="download-btn">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

function navigateToBookDetails(bookId) {
    event.preventDefault();
    window.location.href = `book-details.html?id=${bookId}`;
}

// Add this to your existing books.js file

async function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const session = await window.supabaseClient.auth.getSession();
    
    if (session.data.session) {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        const { data: userData } = await window.supabaseClient
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        userMenu.innerHTML = `
            <div class="user-profile" onclick="toggleDropdown()">
                <img src="${userData.avatar_url || 'assets/images/default-avatar.png'}" 
                     alt="Profile
                     class="user-avatar">
                <span class="user-name">${userData.full_name || 'User'}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="dropdown-menu" id="dropdownMenu">
                <a href="/profile.html" class="dropdown-item">
                    <i class="fas fa-user"></i> Profile
                </a>
                ${userData.role === 'publisher' ? `
                    <a href="/publisher-dashboard.html" class="dropdown-item">
                        <i class="fas fa-book"></i> Publisher Dashboard
                    </a>
                ` : ''}
                <a href="#" class="dropdown-item" onclick="handleLogout(event)">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="/login.html" class="login-btn">Login</a>
            <a href="/signup.html" class="signup-btn">Sign Up</a>
        `;
    }
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.classList.toggle('show');
}

async function handleLogout(event) {
    event.preventDefault();
    try {
        await window.supabaseClient.auth.signOut();
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (dropdownMenu && !userMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    updateUserMenu();
    // ... your existing code ...
});


function updatePagination() {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    document.getElementById('currentPage').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}
let allBooks = [];

async function fetchBooks() {
    try {
        const { data, error } = await window.supabaseClient
            .from('books')
            .select('*');

        if (error) throw error;

        allBooks = data;
        displayBooks(data);
        populateGenreFilter(data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    
    booksContainer.innerHTML = books.map(book => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${book.imageLink}" class="card-img-top" alt="${book.title}" 
                     style="cursor: pointer" onclick="navigateToBookDetails('${book.id}')">
                <div class="card-body">
                    <h5 class="card-title" style="cursor: pointer" 
                        onclick="navigateToBookDetails('${book.id}')">${book.title}</h5>
                    <p class="card-text">${book.author}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <!-- Changed the Read/Download button to redirect to book details -->
                        <button class="btn btn-primary" 
                                onclick="navigateToBookDetails('${book.id}')">
                            Read/Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function navigateToBookDetails(bookId) {
    event.preventDefault();
    window.location.href = `book-details.html?id=${bookId}`;
}// Keep your existing fetch and other functions

function populateGenreFilter(books) {
    const genres = [...new Set(books.map(book => book.genre))];
    const genreFilter = document.getElementById('genreFilter');

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreFilter').value;

    const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    displayBooks(filteredBooks);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    
    // Add event listeners for filters
    document.getElementById('searchInput').addEventListener('input', filterBooks);
    document.getElementById('genreFilter').addEventListener('change', filterBooks);
});