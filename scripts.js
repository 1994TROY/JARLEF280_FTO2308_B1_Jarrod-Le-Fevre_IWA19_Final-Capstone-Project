import { books, genres, authors, BOOKS_PER_PAGE } from './data.js';

let matches = books;
let page = 1;
const range = [0, BOOKS_PER_PAGE];                                                                                      // Declare Range Variable
if (!books || !Array.isArray(books)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const css = {                                                                                                           // Declare css Variable here setout for Theme Toggel
  day: {
      dark: '10, 10, 20',
      light: '255, 255, 255',
  },
  night: {
      dark: '255, 255, 255',
      light: '10, 10, 20',
  }
};

/**
 * Retrieved elements from the DOM using query Selectors
 *  */ 
const dataHeaderSearch = document.querySelector('[data-header-search]')
const dataHeaderSettings = document.querySelector('[data-header-settings]')
const dataListMessage = document.querySelector('[data-list-message]')
const dataListButton = document.querySelector('[data-list-button]')
const dataListActive = document.querySelector('[data-list-active]')
const dataListBlur = document.querySelector('[data-list-blur]')
const dataListImage = document.querySelector('[data-list-image]')
const dataListTitle = document.querySelector('[data-list-title]')
const dataListSubtitle = document.querySelector('[data-list-subtitle]')
const dataListDescription = document.querySelector('[data-list-description]')
const dataListClose = document.querySelector('[data-list-close]')
const dataSearchOverlay = document.querySelector('[data-search-overlay]')
const dataSearchForm = document.querySelector('[data-search-form]')
const dataSearchGenres = document.querySelector('[data-search-genres]')
const dataSearchAuthors = document.querySelector('[data-search-authors]')
const dataSearchCancel = document.querySelector('[data-search-cancel]')
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]')
const dataSettingsForm = document.querySelector('[data-settings-form]')
const dataSettingsTheme = document.querySelector('[data-settings-theme]')
const dataSettingsCancel = document.querySelector('[data-settings-cancel]')
const overlayBackground = document.querySelector('.overlay__background');


/**
 * // this is to display images along with Titles and Authors
 */

let dataListItems = document.querySelector('[data-list-items]');
console.log("dataListItems element:", dataListItems);                                                                   // Debug: Check if dataListItems is correctly selected

// Function to create a preview for each book
function createPreview(book) {
  const element = document.createElement('div');
  element.className = 'preview';                                                                                        //Calling for data from HTML
  element.innerHTML = `                                                                                   
      <img src="${book.image}" alt="Cover of ${book.title}" class="preview__image">
      <div class="preview__info">
          <h3 class="preview__title">${book.title}</h3>
          <p class="preview__author">${authors[book.author]}</p>
      </div>
  `;
  element.addEventListener('click', () => showBookDetails(book));
  return element;
}

const updateBookPreviews = () => {
    dataListItems.innerHTML = '';                                                                                         // Clear the container that holds the book previews
    const fragment = document.createDocumentFragment();                                                                   // Create a document fragment to improve performance when appending children
    const booksToShow = books.slice(0, BOOKS_PER_PAGE);                                                                   // Adjusted to your pagination
    console.log("Books to show:", booksToShow);                                                                           // Debug: Log the books to be displayed

    booksToShow.forEach(book => {                                                                                         // Iterate over the books to create preview elements
        const previewElement = createPreview(book);                                                                       // Create a preview element for each book

        // Add a click event listener to each preview element to show book details
        previewElement.addEventListener('click', () => showBookDetails(book));
        fragment.appendChild(previewElement);                                                                             // Append the preview element to the document fragment
    });
    dataListItems.appendChild(fragment);                                                                                  // Append the document fragment to the dataListItems container
}

/**
 * // Function to show the details of the book in an overlay when a book is clicked
 */

const showBookDetails = (book) => {
  console.log("Showing details for book:", book.title);

  // Set the content of the overlay with the book's details
  dataListTitle.textContent = book.title;
  dataListSubtitle.textContent = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
  dataListDescription.textContent = book.description;
  dataListImage.src = book.image;

  dataListActive.open = true;                                                                                             // Open the overlay to show the book details
  overlayBackground.classList.add('show');
};

// Event listener for the close button on the book details overlay
dataListClose.addEventListener('click', () => {
  dataListActive.close();                                                                                                 // Close the book details overlay
  overlayBackground.classList.remove('show');
  console.log("Book details overlay closed");
  alert("Books to be shown ")
});

updateBookPreviews();                                                                                                     // Initialize the book previews display on page load


/**
 * Function to update the "Show more" button
 */

function updateShowMoreButton() {
  const booksRemaining = matches.length - page * BOOKS_PER_PAGE;
  console.log(`Books remaining before updating button: ${booksRemaining}`);
  dataListButton.textContent = `Show more (${booksRemaining > 0 ? booksRemaining : 0})`;
  dataListButton.disabled = !(booksRemaining > 0);
  console.log(`"Show more" button updated. Text: ${dataListButton.textContent}, Disabled: ${dataListButton.disabled}`);
}

console.log('Updating "Show more" button initially.');
updateShowMoreButton();                                                                                                    // Initial call to update the "Show more" button

dataListButton.addEventListener('click', () => {                                                                           // Event listener for "Show more" button
  console.log(`"Show more" button clicked. Current page: ${page}`);

  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  console.log(`Loading books from index ${startIndex} to ${endIndex}`);

  const newFragments = createPreviewsFragment(matches, startIndex, endIndex);
  dataListItems.appendChild(newFragments);

  page++;
  console.log(`Page incremented to: ${page}`);

  updateShowMoreButton();                                                                                                   // Update the "Show more" button after adding new items
});


/**
 * Event listener for the search form submission
 */

  // Function to perform a search based on the search input 
  function performSearch() {
    // Retrieve the values when the function is called to get the current values
    const titleInputValue = document.querySelector('[data-search-title]').value.trim().toLowerCase();
    const genreInputValue = dataSearchGenres.value; 
    const authorInputValue = dataSearchAuthors.value; 
  
    const searchResults = books.filter(book => {                                                                            // Filter the books based on the search input
      const titleMatch = !titleInputValue || book.title.toLowerCase().includes(titleInputValue);
      const genreMatch = genreInputValue === 'any' || book.genres.includes(genreInputValue);
      const authorMatch = authorInputValue === 'any' || book.author === authorInputValue;
  
      return titleMatch && genreMatch && authorMatch;
    });
  
    
    console.log("Search results:", searchResults);                                                                          // Debug: Log the search results
  
/** 
 * Function to update the display of book previews based on a given set of books
 * */ 

function updateBookPreviews(booksToShow) { 
    dataListItems.innerHTML = '';                                                                                           // Clear the container that holds the book previews
    booksToShow.forEach(book => {                                                                                           // Iterate through each book to create and append its preview element
      const previewElement = createPreview(book);
      dataListItems.appendChild(previewElement);
    });
    console.log("Updated book previews with filtered results.");                                                            // Debug: Confirm the previews have been updated
  }
      
    
    updateBookPreviews(searchResults);                                                                                      // Update the book previews with the search results
    dataSearchOverlay.open = false;                                                                                         // Close the search overlay
  }

  // Event listener for the search form submission
  dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();                                                                                                 // Prevent the default form submission which refreshes the page
    performSearch();                                                                                                        // Call the performSearch function to filter books and update the UI
    console.log("Search form submitted.");                                                                                  // Debug: Log form submission
  }); 
  
  // Event listener for when the search icon is clicked to open the search overlay
  dataHeaderSearch.addEventListener('click', () => {
    dataSearchOverlay.open = true;                                                                                          // Set the overlay to open
    console.log("Search overlay opened.");                                                                                  // Debug: Log overlay opening
  });
  
  // Add the event listener for the 'Close' button in the search overlay
  dataSearchCancel.addEventListener('click', () => {
    dataSearchOverlay.open = false;                                                                                         // Set the overlay to close
    console.log("Search overlay closed.");                                                                                  // Debug: Log overlay closing
  });


/**
 * Creating genres dropdown
 */

let genresFragment = document.createDocumentFragment();                                                                     // Create a document fragment to efficiently add new elements to the DOM
console.log("Created document fragment for genres");
let genresElement = document.createElement('option');                                                                       // Create a default 'option' element for the genre dropdown
genresElement.value = 'any';                                    
genresElement.textContent = 'All Genres';
genresFragment.appendChild(genresElement);                                                                                  // Append the default option to the document fragment
console.log("Appended default genre option to the fragment:", genresElement);

Object.entries(genres).forEach(([id, name]) => {
    let genreElement = document.createElement('option');                                                                    // For each genre, create a new 'option' element for the dropdown
    genreElement.value = id;
    genreElement.textContent = name;
    genresFragment.appendChild(genreElement);
});

dataSearchGenres.appendChild(genresFragment);                                                                               // append the entire collection of genre options to the 'dataSearchGenres' select element

/**
 *  Creating authors dropdown
 */

let authorsFragment = document.createDocumentFragment();
let authorsElement = document.createElement('option');
authorsElement.value = 'any';
authorsElement.textContent = 'All Authors';
authorsFragment.appendChild(authorsElement);

Object.entries(authors).forEach(([id, name]) => {
    let authorElement = document.createElement('option');
    authorElement.value = id;
    authorElement.textContent = name;
    authorsFragment.appendChild(authorElement);
});

dataSearchAuthors.appendChild(authorsFragment);



/**
 * Toggeling of the settings button to set Theme
 */

function toggleSettingsOverlay() {                                                                                        // Function to open/close the theme settings overlay
  console.log(`Settings overlay is now ${dataSettingsOverlay.open ? 'closed' : 'opened'}.`);
  dataSettingsOverlay.open = !dataSettingsOverlay.open;
}
dataHeaderSettings.addEventListener('click', () => {                                                                      // Event listener for the settings button to open the theme settings overlay
  console.log('Settings button clicked.');                                                                                // Debug code: When Settings button has been clicked
  toggleSettingsOverlay();
});
dataSettingsCancel.addEventListener('click', () => {                                                                      // Event listener for the Cancel button to close the settings overlay
  console.log('Cancel button in settings clicked.');                                                                      // Debug code: When Cancel Settings button has been clicked
  toggleSettingsOverlay();
});

function applyTheme(theme) {                                                                                              // Function to apply theme
  console.log(`Applying theme: ${theme}`);                                                                                // Debug code: to indicate what theme was chosen
  document.documentElement.style.setProperty('--color-dark', css[theme].dark);
  document.documentElement.style.setProperty('--color-light', css[theme].light);
}


dataSettingsForm.addEventListener('submit', (event) => {                                                                  // Event listener for the Save button to apply the selected theme and close the overlay
  event.preventDefault();                                                                                                 // Prevent the default form submission
  console.log('Settings form submitted.');                                                                                // Debug code to 
  const selectedTheme = dataSettingsTheme.value;
  console.log(`Selected theme: ${selectedTheme}`);
  applyTheme(selectedTheme);
  toggleSettingsOverlay();                                                                                                // Close the settings overlay
});

let preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';    // Set the initial theme based on the user's preference
console.log(`Preferred theme (based on media query): ${preferredTheme}`);                                                 // Debug Code: This will show if theme pulls
applyTheme(preferredTheme);


// Function to create previews fragment
function createPreviewsFragment(books, startIndex, endIndex) {
  const fragment = document.createDocumentFragment();
  for (let i = startIndex; i < endIndex && i < books.length; i++) {
      const previewElement = createPreview(books[i]);
      fragment.appendChild(previewElement);
  }
  return fragment;
}

dataSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  let result = [];

    if (result.length < 1) {                                                                                            // Display a message if no results are found
      dataListMessage.classList.add('list__message_show');
    } else {
      dataListMessage.classList.remove('list__message_show');
      dataListItems.innerHTML = ''; // Clear existing book previews
      const fragment = document.createDocumentFragment();

    // Create new book previews for the search results
    result.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const element = createPreview(book);
        fragment.appendChild(element);
      });
  
      // Update the UI with the search results
      dataListItems.appendChild(fragment);
    }
  
    // Close the search overlay
    dataSearchOverlay.open = false;
  });
  
  // Event listener for the 'Close' button in the search overlay
  dataSearchCancel.addEventListener('click', () => {
    dataSearchOverlay.open = false; // This closes the search overlay
  });
  
  
dataListItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active;

    for (const node of pathArray) {
        const previewId = node.dataset?.preview;
        if (previewId) {
            active = books.find(book => book.id === previewId);
            break;
        }
    }

    if (!active) return;

    dataListActive.open = true;
    dataListBlur.src = active.image; 
    dataListTitle.textContent = active.title; 
    dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`; 
    dataListDescription.textContent = active.description; 
});

