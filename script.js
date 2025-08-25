let books = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 10;

async function loadBooks() {
  const res = await fetch('books.json');
  books = await res.json();
  filteredBooks = books; // default: show all
  renderBooks();
}

function renderBooks() {
  const grid = document.getElementById('book-grid');
  grid.innerHTML = "";

  // Pagination slice
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const pageBooks = filteredBooks.slice(start, end);

  pageBooks.forEach(book => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-cover">
        <img src="${book.cover}" alt="${book.title} cover">
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
      </div>
      <button class="expand-btn">More Details</button>
      <div class="book-details">
        <img src="${book.cover}" alt="${book.title} cover" class="book-details-cover">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Age Rating:</strong> ${book.ageRating}</p>
        <p><strong>Total Copies:</strong> ${book.totalCopies}</p>
        <p><strong>Available Copies:</strong> ${book.availableCopies}</p>
      </div>
    `;
    grid.appendChild(card);

    // Expand/collapse logic
    const btn = card.querySelector('.expand-btn');
    const details = card.querySelector('.book-details');
    btn.addEventListener('click', () => {
      details.classList.toggle('active');
    });
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const pagination = document.querySelector('.pagination .page-numbers');
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = "page-number" + (i === currentPage ? " active" : "");
    btn.addEventListener('click', () => {
      currentPage = i;
      renderBooks();
    });
    pagination.appendChild(btn);
  }
}

// Filtering + Search
document.getElementById('search-form').addEventListener('submit', e => {
  e.preventDefault();
  const searchVal = document.getElementById('search-bar').value.toLowerCase();
  const genre = document.getElementById('genre-filter').value;
  const age = document.getElementById('age-filter').value;
  const availableOnly = document.getElementById('available-only').checked;
  const sortVal = document.getElementById('sort-filter').value;

  filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchVal) ||
      book.author.toLowerCase().includes(searchVal);
    const matchesGenre = genre ? book.genre.toLowerCase() === genre.toLowerCase() : true;
    const matchesAge = age ? book.ageRating === age : true;
    const matchesAvailable = availableOnly ? book.availableCopies > 0 : true;

    return matchesSearch && matchesGenre && matchesAge && matchesAvailable;
  });

  // Sorting
  if (sortVal) {
    filteredBooks.sort((a, b) => {
      switch (sortVal) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "author-desc":
          return b.author.localeCompare(a.author);
        case "copies-desc":
          return b.availableCopies - a.availableCopies;
        case "copies-asc":
          return a.availableCopies - b.availableCopies;
        default:
          return 0;
      }
    });
  }

  currentPage = 1;
  renderBooks();
});
