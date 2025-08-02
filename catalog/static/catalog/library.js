// OOP Classes
class Book {
    constructor(id, title, author, isbn, totalCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }
}

class User {
    constructor(name, email, password, role, studentId = null) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.studentId = studentId;
    }
}

class BorrowedBook {
    constructor(book, student, borrowDate, returnDate) {
        this.book = book;
        this.student = student;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
    }
}

// In-memory data
const users = [];
const books = [];
const borrowedBooks = [];

let currentUser = null;

// DOM Elements
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const logoutLink = document.getElementById("logout-link");
const adminLink = document.getElementById("admin-link");
const studentLink = document.getElementById("student-link");
const homeLink = document.getElementById("home-link");

const homeContent = document.getElementById("home-content");
const loginContent = document.getElementById("login-content");
const registerContent = document.getElementById("register-content");
const adminContent = document.getElementById("admin-content");
const studentContent = document.getElementById("student-content");

// Navigation
loginLink.onclick = () => showSection("login");
registerLink.onclick = () => showSection("register");
logoutLink.onclick = () => {
    currentUser = null;
    toggleLinks();
    showSection("home");
};
adminLink.onclick = () => showSection("admin");
studentLink.onclick = () => showSection("student");
homeLink.onclick = () => showSection("home");

function showSection(section) {
    homeContent.classList.add("hidden");
    loginContent.classList.add("hidden");
    registerContent.classList.add("hidden");
    adminContent.classList.add("hidden");
    studentContent.classList.add("hidden");

    if (section === "home") homeContent.classList.remove("hidden");
    if (section === "login") loginContent.classList.remove("hidden");
    if (section === "register") registerContent.classList.remove("hidden");
    if (section === "admin") adminContent.classList.remove("hidden");
    if (section === "student") studentContent.classList.remove("hidden");
}

// Toggle navigation links based on user role
function toggleLinks() {
    if (!currentUser) {
        loginLink.classList.remove("hidden");
        registerLink.classList.remove("hidden");
        logoutLink.classList.add("hidden");
        adminLink.classList.add("hidden");
        studentLink.classList.add("hidden");
    } else {
        loginLink.classList.add("hidden");
        registerLink.classList.add("hidden");
        logoutLink.classList.remove("hidden");
        if (currentUser.role === "admin") {
            adminLink.classList.remove("hidden");
            studentLink.classList.add("hidden");
        } else {
            adminLink.classList.add("hidden");
            studentLink.classList.remove("hidden");
        }
    }
}

// Login
document.getElementById("login-btn").onclick = function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("login-role").value;
    const error = document.getElementById("login-error");

    const user = users.find(
        u => u.email === email && u.password === password && u.role === role
    );

    if (user) {
        currentUser = user;
        toggleLinks();
        showSection(role === "admin" ? "admin" : "student");
        error.textContent = "";
        if (role === "admin") updateBooksTable();
        if (role === "student") updateAvailableBooksTable();
    } else {
        error.textContent = "Invalid credentials!";
    }
};

// Register
document.getElementById("register-btn").onclick = function () {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const studentId = document.getElementById("reg-student-id").value;
    const error = document.getElementById("register-error");
    const success = document.getElementById("register-success");

    if (users.find(u => u.email === email)) {
        error.textContent = "Email already registered!";
        success.textContent = "";
        return;
    }

    const user = new User(name, email, password, "student", studentId);
    users.push(user);
    error.textContent = "";
    success.textContent = "Registered successfully!";
};

// Admin Add Book
document.getElementById("add-book-btn").onclick = function () {
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const isbn = document.getElementById("book-isbn").value;
    const copies = parseInt(document.getElementById("book-copies").value);
    const id = books.length + 1;
    const error = document.getElementById("add-book-error");
    const success = document.getElementById("add-book-success");

    if (!title || !author || !isbn || !copies) {
        error.textContent = "Please fill all fields.";
        success.textContent = "";
        return;
    }

    const book = new Book(id, title, author, isbn, copies);
    books.push(book);
    updateBooksTable();
    updateAvailableBooksTable();
    error.textContent = "";
    success.textContent = "Book added successfully!";
};

// Admin Remove Book
document.getElementById("remove-book-btn").onclick = function () {
    const bookId = parseInt(document.getElementById("remove-book-id").value);
    const error = document.getElementById("remove-book-error");
    const success = document.getElementById("remove-book-success");

    const index = books.findIndex(b => b.id === bookId);
    if (index === -1) {
        error.textContent = "Book not found.";
        success.textContent = "";
        return;
    }

    books.splice(index, 1);
    updateBooksTable();
    updateAvailableBooksTable();
    error.textContent = "";
    success.textContent = "Book removed successfully!";
};

// Update Admin Book Table
function updateBooksTable() {
    const tbody = document.getElementById("books-table-body");
    tbody.innerHTML = "";
    books.forEach(book => {
        const row = `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td>${book.availableCopies}</td><td>${book.totalCopies}</td></tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

// Update Student Available Books Table
function updateAvailableBooksTable() {
    const tbody = document.getElementById("available-books-table-body");
    tbody.innerHTML = "";
    books.forEach(book => {
        if (book.availableCopies > 0) {
            const row = `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td>${book.availableCopies}</td><td><button onclick="borrowBook(${book.id})">Borrow</button></td></tr>`;
            tbody.insertAdjacentHTML("beforeend", row);
        }
    });
}

// Student Borrow Book
function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return;

    const borrowDate = new Date().toLocaleDateString();
    const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
    borrowedBooks.push(new BorrowedBook(book, currentUser, borrowDate, returnDate));
    book.availableCopies--;
    updateAvailableBooksTable();
    updateBorrowedBooksTable();
}

// Student Return Book
document.getElementById("return-book-btn").onclick = function () {
    const bookId = parseInt(document.getElementById("return-book-id").value);
    const error = document.getElementById("return-book-error");
    const success = document.getElementById("return-book-success");

    const index = borrowedBooks.findIndex(bb => bb.book.id === bookId && bb.student.email === currentUser.email);
    if (index === -1) {
        error.textContent = "Book not found in your borrowed list.";
        success.textContent = "";
        return;
    }

    borrowedBooks[index].book.availableCopies++;
    borrowedBooks.splice(index, 1);
    updateAvailableBooksTable();
    updateBorrowedBooksTable();
    error.textContent = "";
    success.textContent = "Book returned successfully!";
};

// Update Student Borrowed Books Table
function updateBorrowedBooksTable() {
    const tbody = document.getElementById("borrowed-books-table-body");
    tbody.innerHTML = "";
    borrowedBooks
        .filter(bb => bb.student.email === currentUser.email)
        .forEach(bb => {
            const row = `<tr><td>${bb.book.id}</td><td>${bb.book.title}</td><td>${bb.book.author}</td><td>${bb.borrowDate}</td><td>${bb.returnDate}</td></tr>`;
            tbody.insertAdjacentHTML("beforeend", row);
        });

    const allTbody = document.getElementById("borrowers-table-body");
    allTbody.innerHTML = "";
    borrowedBooks.forEach(bb => {
        const row = `<tr><td>${bb.book.id}</td><td>${bb.book.title}</td><td>${bb.student.studentId}</td><td>${bb.student.name}</td><td>${bb.borrowDate}</td><td>${bb.returnDate}</td></tr>`;
        allTbody.insertAdjacentHTML("beforeend", row);
    });
}

// Tab Switching
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");

    if (tabName === "view-books") updateBooksTable();
    if (tabName === "available-books") updateAvailableBooksTable();
    if (tabName === "borrowed-books") updateBorrowedBooksTable();
    if (tabName === "view-borrowers") updateBorrowedBooksTable();
}
