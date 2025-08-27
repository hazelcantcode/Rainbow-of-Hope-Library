document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const searchInput = document.getElementById("search");
    const genreFilter = document.getElementById("genre-filter");
    const ageFilter = document.getElementById("age-filter");
    const pagination = document.getElementById("pagination");

    let books = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 12;

    // Fetch books from JSON
    fetch("books.json")
        .then(response => response.json())
        .then(data => {
            books = data;
            filteredBooks = [...books];
            populateFilters();
            renderBooks();
            renderPagination();
        })
        .catch(error => console.error("Error loading books:", error));

    // Populate dropdown filters
    function populateFilters() {
        const genres = [...new Set(books.map(book => book.genre))].sort();
        const ages = [...new Set(books.map(book => book.ageRating))].sort();

        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        ages.forEach(age => {
            const option = document.createElement("option");
            option.value = age;
            option.textContent = age;
            ageFilter.appendChild(option);
        });
    }

    // Render books for current page
    function renderBooks() {
        bookList.innerHTML = "";

        const start = (currentPage - 1) * booksPerPage;
        const end = start + booksPerPage;
        const pageBooks = filteredBooks.slice(start, end);

        if (pageBooks.length === 0) {
            bookList.innerHTML = "<p>No books found.</p>";
            return;
        }

        pageBooks.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.cover}" alt="${book.title} cover" class="book-cover">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <button class="expand-btn">View Details</button>
                <div class="book-details" style="display: none;">
                    <p><strong>Description:</strong> ${book.description}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Age Rating:</strong> ${book.ageRating}</p>
                    <p><strong>Total Copies:</strong> ${book.totalCopies}</p>
                    <p><strong>Available Copies:</strong> ${book.availableCopies}</p>
                </div>
            `;

            // Toggle details
            const expandBtn = bookCard.querySelector(".expand-btn");
            const details = bookCard.querySelector(".book-details");
            expandBtn.addEventListener("click", () => {
                const isVisible = details.style.display === "block";
                details.style.display = isVisible ? "none" : "block";
                expandBtn.textContent = isVisible ? "View Details" : "Hide Details";
            });

            bookList.appendChild(bookCard);
        });
    }

    // Render pagination controls
    function renderPagination() {
        pagination.innerHTML = "";
        const pageCount = Math.ceil(filteredBooks.length / booksPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            if (i === currentPage) button.classList.add("active");
            button.addEventListener("click", () => {
                currentPage = i;
                renderBooks();
                renderPagination();
            });
            pagination.appendChild(button);
        }
    }

    // Search and filter
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedAge = ageFilter.value;

        filteredBooks = books.filter(book => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
            const matchesAge = selectedAge ? book.ageRating === selectedAge : true;

            return matchesSearch && matchesGenre && matchesAge;
        });

        currentPage = 1;
        renderBooks();
        renderPagination();
    }

    searchInput.addEventListener("input", applyFilters);
    genreFilter.addEventListener("change", applyFilters);
    ageFilter.addEventListener("change", applyFilters);
});

// Fetch books from books.json
fetch("books.json")
  .then(response => response.json())
  .then(data => {
    books = data;
    renderBooks(books);
    populateFilters(books);
  })
  .catch(err => console.error("Error loading books:", err));
