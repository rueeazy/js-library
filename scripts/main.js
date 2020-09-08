var database = firebase.database();
const preObject = document.getElementsByClassName('book');
const dbRefObject = firebase.database().ref().child('book');
dbRefObject.on('value', snap => console.log(snap.val()));

let myLibrary = [];

let libraryContainer = document.querySelector(".library-container");
let newDiv = document.createElement("div");
let newBookBtn = document.querySelector('.bookbtn');
let bookForm = document.querySelector('.btn-form');
let collection = document.getElementsByClassName('book');

// Book Constructor Function //
function Book(title, author, pages, status) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.status = status
}

//changes status to Read using prototype
Book.prototype.readBook = function(book) {
    console.log("hey!");
    book.childNodes[3].textContent = "Read";
    // //removes button after press
    book.lastChild.style.display = 'none';
}

//Bring up form
newBookBtn.addEventListener('click', addBookInfo);

function addBookInfo(e) {
    newBookBtn.style.display = 'none';
    bookForm.style.display = 'block';
}

// Submit parameters
bookForm.addEventListener('submit', createBook);

function createBook(e) {
    e.preventDefault();

    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let pages = document.querySelector('#pages').value;
    let status = document.querySelectorAll('input[name="status"]');
    // check radio button value
    let selectedValue;
    for(let value of status) {
        if(value.checked) {
            selectedValue = value.value;
            break;
        }
    }
    addBookToLibrary(title, author, pages, selectedValue);
    resetForm();
} 

//Create Book With Info
function addBookToLibrary(title, author, pages, status) {
    let book = new Book(title, author, pages, status);
    myLibrary.push(book)
    createCard(book);
    writeBookData(title, author, pages, status);
}

//Adds book to Db
function writeBookData(title, author, pages, status) {
    firebase.database().ref('books/' + title).set({
        book_title: title,
        book_author: author,
        page_count: pages,
        read_status: status
    });
}

// Creates New Book Card
function createCard(book) {
    let bookTitle = document.createElement('h3');
    bookTitle.appendChild(document.createTextNode(book.title));
    let bookAuthor = document.createElement('h5');
    bookAuthor.appendChild(document.createTextNode(book.author));
    let bookPages = document.createElement('h5');
    bookPages.appendChild(document.createTextNode(book.pages));
    let bookStatus = document.createElement('h5');
    bookStatus.className = 'unread';
    bookStatus.appendChild(document.createTextNode(book.status));
    //Appends card elements to Card
    let newBook = document.createElement('div');
    newBook.className = 'book';
    newBook.setAttribute('data-index', myLibrary.length)
    newBook.appendChild(bookTitle);
    newBook.appendChild(bookAuthor);
    newBook.appendChild(bookPages);
    newBook.appendChild(bookStatus);
    //Appends card to library
    libraryContainer.appendChild(newBook);
    //add event listener for delete
    addDeleteButton(newBook);
    //add read button
    if(bookStatus.textContent == "Unread") {
        addReadButton(newBook);
    }
}

function addReadButton(newBook) {
    let readBtn = document.createElement('button');
    readBtn.className =  'read';
    readBtn.appendChild(document.createTextNode('Read'));
    newBook.appendChild(readBtn);
    for(let book of collection) {
        book.addEventListener('click', readBook);
    }  
}

//add delete button
function addDeleteButton(newBook) {
    let deleteBtn = document.createElement('button');
    deleteBtn.className =  'delete';
    deleteBtn.appendChild(document.createTextNode('Delete'));
    newBook.appendChild(deleteBtn);
    for(let book of collection) {
        book.addEventListener('click', deleteBook);
    }
}

//adds read button
function readBook(e) {
    if(e.target.classList.contains('read')) {
        book = myLibrary[this.dataset.index - 1]
        book.readBook(this);
    }
}

//delete book card
function deleteBook(e) {
    if(e.target.classList.contains('delete')) {
        if(confirm('Are your sure?')) {
            let book = e.target.parentElement;
            libraryContainer.removeChild(book);
        }
    }
}

//reset form after submit
function resetForm() {
    document.querySelector('#title').value="";
    document.querySelector('#author').value="";
    document.querySelector('#pages').value="";
    let status = document.querySelectorAll('input[name="status"]');
    for(let value of status) {
        if(value.checked) {
            value.checked = false;
            break;
        }
    }
}

