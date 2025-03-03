function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to display book details
// Function to display book details
function displayBookDetails(book) {
    const bookDetailsElement = document.getElementById('bookDetails');
    if (!bookDetailsElement) return;

    // Determine whether the book is free or not
    const isFree = book.price === 0 || !book.price; // Assuming 0 or null means free

    bookDetailsElement.innerHTML = `
        <div class="book-container">
            <div class="book-image">
                <img src="${book.cover_image_url || 'placeholder.jpg'}" alt="${book.title}" class="img-fluid">
            </div>
            <div class="book-info">
                <h1>${book.title}</h1>
                <h3>by ${book.author}</h3>
                <p class="book-genre">Genre: ${book.genre}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-meta">
                    <p>ISBN: ${book.isbn}</p>
                    <p>Published: ${new Date(book.created_at).getFullYear()}</p>
                    <p>Pages: ${book.pages}</p>
                    <p>price: ${book.price || 'Free'}</p>
                </div>
                <div class="average-rating" id="averageRating">
                    Average Rating: <span id="ratingValue">0</span>/5
                </div>
                <!-- Read or Checkout Button -->
                <button onclick="redirectToReadOrCheckout('${book.id}', ${isFree})">
                    ${isFree ? 'Read Now' : 'Buy Now'}
                </button>
            </div>
        </div>
    `;
}

// Function to handle redirection based on book price
function redirectToReadOrCheckout(bookId, isFree) {
    if (isFree) {
        window.location.href = `read.html?id=${bookId}`;
    } else {
        window.location.href = `checkout.html?id=${bookId}`;
    }
}

// Fetch book details with price check
async function fetchBookDetails(bookId) {
    try {
        const { data: book, error } = await window.supabase
            .from('books')
            .select('*')
            .eq('id', bookId)
            .single();

        if (error) throw error;

        if (book) {
            displayBookDetails(book);
            await fetchReviews(bookId);
        } else {
            throw new Error('Book not found');
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        const bookDetails = document.getElementById('bookDetails');
        if (bookDetails) {
            bookDetails.innerHTML = '<div class="alert alert-danger">Error loading book details</div>';
        }
    }
}
// Function to display reviews
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;

    if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
        return;
    }

    const reviewsHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="stars">
                    ${displayStars(review.rating)}
                </div>
                <div class="review-date">
                    ${new Date(review.created_at).toLocaleDateString()}
                </div>
            </div>
            <div class="review-content">
                ${review.review_text}
            </div>
        </div>
    `).join('');

    reviewsContainer.innerHTML = reviewsHTML;
}

// Function to display stars
function displayStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Initialize star rating system
function initializeStarRating() {
    const starsDisplay = document.getElementById('starsDisplay');
    if (!starsDisplay) return;

    starsDisplay.innerHTML = ''; // Clear existing content
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '☆';
        star.className = 'star';
        star.addEventListener('click', () => {
            updateStars(i);
            const ratingInput = document.getElementById('ratingInput');
            if (ratingInput) ratingInput.value = i;
        });
        starsDisplay.appendChild(star);
    }
}

// Update stars display
function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.innerHTML = index < rating ? '★' : '☆';
    });
}

// Fetch reviews
async function fetchReviews(bookId) {
    try {
        const { data: reviews, error } = await window.supabase
            .from('reviews')
            .select('*')
            .eq('book_id', bookId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        displayReviews(reviews || []);
        updateAverageRating(reviews || []);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Update average rating
function updateAverageRating(reviews) {
    if (!reviews.length) return;

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const ratingValue = document.getElementById('ratingValue');
    if (ratingValue) {
        ratingValue.textContent = averageRating.toFixed(1);
    }
}

// Handle review submission
function handleReviewSubmission(bookId) {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const rating = document.getElementById('ratingInput').value;
        const reviewText = document.getElementById('reviewText').value;

        try {
            const { data, error } = await window.supabase
                .from('reviews')
                .insert([
                    {
                        book_id: bookId,
                        rating: parseInt(rating),
                        review_text: reviewText,
                    }
                ]);

            if (error) throw error;

            // Clear form and refresh reviews
            form.reset();
            updateStars(0);
            await fetchReviews(bookId);
            
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    });
}

// Fetch book details
async function fetchBookDetails(bookId) {
    try {
        const { data: book, error } = await window.supabase
            .from('books')
            .select('*')
            .eq('id', bookId)
            .single();

        if (error) throw error;

        if (book) {
            displayBookDetails(book);
            await fetchReviews(bookId);
        } else {
            throw new Error('Book not found');
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        const bookDetails = document.getElementById('bookDetails');
        if (bookDetails) {
            bookDetails.innerHTML = '<div class="alert alert-danger">Error loading book details</div>';
        }
    }
}

// Check auth status (placeholder - implement based on your auth setup)
async function checkAuthStatus() {
    // Implement your auth check logic here
    return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bookId = getBookIdFromUrl();
        if (!bookId) {
            const bookDetails = document.getElementById('bookDetails');
            if (bookDetails) {
                bookDetails.innerHTML = '<div class="alert alert-danger">No book ID provided</div>';
            }
            return;
        }

        // Initialize components
        initializeStarRating();
        await fetchBookDetails(bookId);
        handleReviewSubmission(bookId);
        await checkAuthStatus();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});