// script.js

// DOM elements
const booksContainer = document.getElementById("books-container");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const ageFilter = document.getElementById("age-filter");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

// Pagination state
let currentPage = 1;
const booksPerPage = 8;

// Data store
let books = [];
let filteredBooks = [];

// Fetch books from JSON file
async function loadBooks() {
  try {
    const response = await fetch("books.json"); // must be in same folder or change path
    books = await response.json();
    filteredBooks = books;
    populateFilters();
    renderBooks();
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

// Populate dropdown filters with unique values
function populateFilters() {
  const genres = [...new Set(books.map(book => book.genre))];
  const ageRatings = [...new Set(books.map(book => book.ageRating))];

  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  ageRatings.forEach(rating => {
    const option = document.createElement("option");
    option.value = rating;
    option.textContent = rating;
    ageFilter.appendChild(option);
  });
}

// Render books to page
function renderBooks() {
  booksContainer.innerHTML = "";

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  if (paginatedBooks.length === 0) {
    booksContainer.innerHTML = "<p>No books found.</p>";
    return;
  }

  paginatedBooks.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
      <img src="${book.cover}" alt="${book.title} cover" class="book-cover">
      <h3>${book.title}</h3>
      <p><em>${book.author}</em></p>
      <button class="expand-btn">Details</button>
      <div class="book-details hidden">
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Age Rating:</strong> ${book.ageRating}</p>
        <p><strong>Copies in Library:</strong> ${book.copies}</p>
        <p><strong>Available Copies:</strong> ${book.available}</p>
      </div>
    `;

    // Expand/collapse functionality
    const expandBtn = bookCard.querySelector(".expand-btn");
    const details = bookCard.querySelector(".book-details");
    expandBtn.addEventListener("click", () => {
      details.classList.toggle("hidden");
      expandBtn.textContent = details.classList.contains("hidden") ? "Details" : "Hide";
    });

    booksContainer.appendChild(bookCard);
  });

  updatePaginationControls();
}

// Update pagination buttons
function updatePaginationControls() {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Apply filters and search
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const genre = genreFilter.value;
  const age = ageFilter.value;

  filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesGenre = genre === "all" || book.genre === genre;
    const matchesAge = age === "all" || book.ageRating === age;

    return matchesSearch && matchesGenre && matchesAge;
  });

  currentPage = 1;
  renderBooks();
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
ageFilter.addEventListener("change", applyFilters);
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
  }
});
nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBooks();
  }
});

// Initialize
loadBooks();
