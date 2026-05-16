const PASSWORD = "myd";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDQYh15eSCMDvBXvMyVryRNuEWQdGR_9QQ",
    authDomain: "biblio-mar.firebaseapp.com",
    projectId: "biblio-mar",
    storageBucket: "biblio-mar.firebasestorage.app",
    messagingSenderId: "762754771629",
    appId: "1:762754771629:web:0b22190a2dd5a816c8b424"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let books = [];
let wishlist = [];

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

async function saveBook() {

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
        const bookId = books[editingIndex].id;
        await updateDoc(doc(db, 'books', bookId), book);
    } else {
        await addDoc(collection(db, 'books'), book);
    }

    await loadBooks();

    closeBookModal();
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

async function deleteBook(index) {

    if (!checkPassword()) {
        alert('Contraseña incorrecta');
        return;
    }

    const bookId = books[index].id;
    await deleteDoc(doc(db, 'books', bookId));

    await loadBooks();
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

async function saveWishlist() {

    const item = {
        title: document.getElementById('wishTitle').value,
        author: document.getElementById('wishAuthor').value,
        priority: document.getElementById('wishPriority').value,
        notes: document.getElementById('wishNotes').value
    };

    if (editingWishlistIndex !== null) {
        const wishId = wishlist[editingWishlistIndex].id;
        await updateDoc(doc(db, 'wishlist', wishId), item);
    } else {
        await addDoc(collection(db, 'wishlist'), item);
    }

    await loadWishlist();

    closeWishlistModal();
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

async function deleteWishlist(index) {

    if (!checkPassword()) {
        alert('Contraseña incorrecta');
        return;
    }

    const wishId = wishlist[index].id;
    await deleteDoc(doc(db, 'wishlist', wishId));

    await loadWishlist();
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
                    '#7c5c4f',
                    '#d1b38b',
                    '#b23b3b'
                ]
            }]
        }
    });
}

async function loadBooks() {

    const querySnapshot = await getDocs(collection(db, 'books'));

    books = [];

    querySnapshot.forEach((documento) => {
        books.push({
            id: documento.id,
            ...documento.data()
        });
    });

    renderBooks();
    updateDashboard();
}

async function loadWishlist() {

    const querySnapshot = await getDocs(collection(db, 'wishlist'));

    wishlist = [];

    querySnapshot.forEach((documento) => {
        wishlist.push({
            id: documento.id,
            ...documento.data()
        });
    });

    renderWishlist();
}

window.showSection = showSection;
window.openBookModal = openBookModal;
window.closeBookModal = closeBookModal;
window.saveBook = saveBook;
window.deleteBook = deleteBook;
window.openWishlistModal = openWishlistModal;
window.closeWishlistModal = closeWishlistModal;
window.saveWishlist = saveWishlist;
window.deleteWishlist = deleteWishlist;

document.addEventListener('DOMContentLoaded', async () => {
    await loadBooks();
    await loadWishlist();
});
