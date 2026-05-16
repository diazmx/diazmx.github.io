const PASSWORD = "myd";

let books = JSON.parse(localStorage.getItem("books")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let editingIndex = null;
let editingWishlistIndex = null;
let chart;

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
}

function checkPassword() {
    const password = prompt("Ingresa la contraseña:");
    return password === PASSWORD;
}

function openBookModal(index = null) {

    if (!checkPassword()) {
        alert("Contraseña incorrecta");
        return;
    }

    editingIndex = index;

    if (index !== null) {
        const book = books[index];

        document.getElementById('modalTitle').innerText = 'Editar Libro';

        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('genre').value = book.genre;
        document.getElementById('status').value = book.status;
        document.getElementById('priority').value = book.priority;
        document.getElementById('rating').value = book.rating;
        document.getElementById('startDate').value = book.startDate;
        document.getElementById('endDate').value = book.endDate;
        document.getElementById('recommendable').value = book.recommendable;
        document.getElementById('reread').value = book.reread;
        document.getElementById('notes').value = book.notes;

    } else {
        document.getElementById('modalTitle').innerText = 'Agregar Libro';
        clearBookForm();
    }

    document.getElementById('bookModal').classList.remove('hidden');
}

function closeBookModal() {
    document.getElementById('bookModal').classList.add('hidden');
}

function clearBookForm() {
    document.querySelectorAll('#bookModal input, #bookModal textarea').forEach(el => el.value = '');

    document.getElementById('status').value = 'Pendiente';
    document.getElementById('priority').value = 'Media';
    document.getElementById('recommendable').value = 'Sí';
    document.getElementById('reread').value = 'Sí';
}

function saveBook() {

    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        rating: document.getElementById('rating').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        recommendable: document.getElementById('recommendable').value,
        reread: document.getElementById('reread').value,
        notes: document.getElementById('notes').value
    };

    if (editingIndex !== null) {
        books[editingIndex] = book;
    } else {
        books.push(book);
    }

    localStorage.setItem('books', JSON.stringify(books));

    closeBookModal();
    renderBooks();
    updateDashboard();
}

function renderBooks() {

    const container = document.getElementById('booksContainer');
    container.innerHTML = '';

    books.forEach((book, index) => {

        container.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.status}</td>
                <td>${book.priority}</td>
                <td>${book.rating}</td>
                <td>${book.startDate || '-'}</td>
                <td>${book.endDate || '-'}</td>
                <td>${book.recommendable}</td>
                <td>${book.reread}</td>
                <td>${book.notes}</td>
                <td>
                    <div class="book-actions">
                        <button class="edit-btn" onclick="openBookModal(${index})">Editar</button>
                        <button class="delete-btn" onclick="deleteBook(${index})">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function deleteBook(index) {

    if (!checkPassword()) {
        alert('Contraseña incorrecta');
        return;
    }

    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));

    renderBooks();
    updateDashboard();
}

function openWishlistModal(index = null) {

    if (!checkPassword()) {
        alert('Contraseña incorrecta');
        return;
    }

    editingWishlistIndex = index;

    if (index !== null) {

        const item = wishlist[index];

        document.getElementById('wishTitle').value = item.title;
        document.getElementById('wishAuthor').value = item.author;
        document.getElementById('wishPriority').value = item.priority;
        document.getElementById('wishNotes').value = item.notes;

    } else {

        document.getElementById('wishTitle').value = '';
        document.getElementById('wishAuthor').value = '';
        document.getElementById('wishPriority').value = 'Media';
        document.getElementById('wishNotes').value = '';
    }

    document.getElementById('wishlistModal').classList.remove('hidden');
}

function closeWishlistModal() {
    document.getElementById('wishlistModal').classList.add('hidden');
}

function saveWishlist() {

    const item = {
        title: document.getElementById('wishTitle').value,
        author: document.getElementById('wishAuthor').value,
        priority: document.getElementById('wishPriority').value,
        notes: document.getElementById('wishNotes').value
    };

    if (editingWishlistIndex !== null) {
        wishlist[editingWishlistIndex] = item;
    } else {
        wishlist.push(item);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    closeWishlistModal();
    renderWishlist();
}

function renderWishlist() {

    const container = document.getElementById('wishlistContainer');
    container.innerHTML = '';

    wishlist.forEach((item, index) => {

        container.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.author}</td>
                <td>${item.priority}</td>
                <td>${item.notes}</td>
                <td>
                    <div class="book-actions">
                        <button class="edit-btn" onclick="openWishlistModal(${index})">Editar</button>
                        <button class="delete-btn" onclick="deleteWishlist(${index})">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function deleteWishlist(index) {

    if (!checkPassword()) {
        alert('Contraseña incorrecta');
        return;
    }

    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    renderWishlist();
}

function updateDashboard() {

    const total = books.length;
    const read = books.filter(book => book.status === 'Leído').length;
    const pending = books.filter(book => book.status === 'Pendiente').length;
    const abandoned = books.filter(book => book.status === 'Abandonado').length;

    document.getElementById('totalBooks').innerText = total;
    document.getElementById('readBooks').innerText = read;
    document.getElementById('pendingBooks').innerText = pending;
    document.getElementById('abandonedBooks').innerText = abandoned;

    renderChart(read, pending, abandoned);
}

function renderChart(read, pending, abandoned) {

    const ctx = document.getElementById('statusChart');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Leídos', 'Pendientes', 'Abandonados'],
            datasets: [{
                data: [read, pending, abandoned],
                backgroundColor: [
                    '#5f2568',
                    '#b37eb5',
                    'rgba(95, 37, 104, 0.25)'
                ]
            }]
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    renderWishlist();
    updateDashboard();
});