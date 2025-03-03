// Load trending books
async function GOtoADDpage() {

    add_book= document.getElementById('add-content-btn')
    add_book.addEventListener('click', function() {
        window.location.href = 'add-book.html';
    });
    
}

async function loadTrendingBooks() {
    try {
        const { data, error } = await window.supabaseClient
            .from('books')
            .select('*')
            .order('views', { ascending: false })
            .limit(5);

        if (error) throw error;

        const trendingBooksElement = document.getElementById('trending-books');
        if (trendingBooksElement) {
            trendingBooksElement.innerHTML = updateBookItemsHTML(data);
        }
    } catch (error) {
        console.error('Error loading trending books:', error);
    }
}

// Load new releases
async function loadNewReleases() {
    try {
        const { data, error } = await window.supabaseClient
            .from('books')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        const newReleasesElement = document.getElementById('new-releases');
        if (newReleasesElement) {
            newReleasesElement.innerHTML = updateBookItemsHTML(data);
        }
    } catch (error) {
        console.error('Error loading new releases:', error);
    }
}

// Load featured publishers
async function loadFeaturedPublishers() {
    try {
        const { data, error } = await window.supabaseClient
            .from('publishers')
            .select('*')
            .order('rating', { ascending: false })
            .limit(4);

        if (error) throw error;

        const publishersElement = document.getElementById('featured-publishers');
        if (publishersElement) {
            publishersElement.innerHTML = updatePublisherCardsHTML(data);
        }
    } catch (error) {
        console.error('Error loading featured publishers:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingBooks();
    loadNewReleases();
    loadFeaturedPublishers();
});

// ... existing code ...
// ... rest of your existing code ...


// Search functionality
document.querySelector('.search-bar input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        const searchQuery = e.target.value;
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingBooks();
    loadNewReleases();
    loadFeaturedPublishers();
});
// ... existing code (loadTrendingBooks, loadNewReleases, loadFeaturedPublishers) ...

// Button functionality
function initializeButtons() {
    // Get Started button
    const getStartedBtn = document.querySelector('.cta-button');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            window.location.href = '/signup.html';
        });
    }

    // Login button
    const loginBtn = document.querySelector('.login-button');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Browse All Books button
    const browseAllBooksBtn = document.querySelector('.browse-all-books');
    if (browseAllBooksBtn) {
        browseAllBooksBtn.addEventListener('click', () => {
            window.location.href = 'books.html';
        });
    }

    // View All Publishers button
    const viewAllPublishersBtn = document.querySelector('.view-all-publishers');
    if (viewAllPublishersBtn) {
        viewAllPublishersBtn.addEventListener('click', () => {
            window.location.href = 'publishers.html';
        });
    }

    // Book items click handler
    document.querySelectorAll('.book-item').forEach(book => {
        book.addEventListener('click', (e) => {
            const bookId = e.currentTarget.dataset.bookId;
            window.location.href = `book-details.html?id=${bookId}`;
        });
    });

    // Publisher cards click handler
    document.querySelectorAll('.publisher-card').forEach(publisher => {
        publisher.addEventListener('click', (e) => {
            const publisherId = e.currentTarget.dataset.publisherId;
            window.location.href = `/publisher-profile.html?id=${publisherId}`;
        });
    });

    // Search button
    const searchBtn = document.querySelector('.search-button');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

// Search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery) {
        window.location.href = `/search-results.html?q=${encodeURIComponent(searchQuery)}`;
    }
}

// Update your book and publisher rendering functions to include data-attributes
function updateBookItemsHTML(data) {
    return data.map(book => `
        <div class="book-item" data-book-id="${book.id}">
            <img src="${book.cover_image_url}" alt="${book.title}">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <span class="price">$${book.price}</span>
            </div>
        </div>
    `).join('');
}

function updatePublisherCardsHTML(data) {
    return data.map(publisher => `
        <div class="publisher-card" data-publisher-id="${publisher.id}">
            <img src="${publisher.logo_url}" alt="${publisher.name}">
            <h3>${publisher.name}</h3>
            <p>${publisher.description}</p>
        </div>
    `).join('');
}

function updatePublisherCardsHTML(publishers) {
    return `
        <div class="featured-publishers-container">
            ${publishers.map(publisher => `
                <div class="publisher-card">
                    <img src="${publisher.logo_url || 'path/to/default-publisher-image.png'}" 
                         alt="${publisher.name}"
                         onerror="this.src='assets/images/default-publisher.png'">
                    <h3>${publisher.name}</h3>
                    <p>${publisher.description ? publisher.description.substring(0, 100) + '...' : 'No description available'}</p>
                    <div class="publisher-stats">
                        <span>⭐ ${publisher.rating.toFixed(1)}</span>
                        <span>📚 ${publisher.total_books}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ... existing code ...

// Update your loading functions to use the new HTML generators
async function loadTrendingBooks() {
    try {
        const { data, error } = await window.supabaseClient
            .from('books')
            .select('*')
            .order('views', { ascending: false })
            .limit(5);

        if (error) throw error;

        const trendingBooksElement = document.getElementById('trending-books');
        trendingBooksElement.innerHTML = updateBookItemsHTML(data);
    } catch (error) {
        console.error('Error loading trending books:', error);
    }
}

async function loadFeaturedPublishers() {
    try {
        const { data, error } = await window.supabaseClient
            .from('publishers')
            .select('*')
            .order('rating', { ascending: false })
            .limit(4);

        if (error) throw error;

        const publishersElement = document.getElementById('featured-publishers');
        publishersElement.innerHTML = updatePublisherCardsHTML(data);
    } catch (error) {
        console.error('Error loading featured publishers:', error);
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingBooks();
    loadNewReleases();
    loadFeaturedPublishers();
    initializeButtons();

    // Add search input enter key handler
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTrendingBooks();
        await loadNewReleases();
        await loadFeaturedPublishers();
        initializeButtons();

        // Add search input enter key handler
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});