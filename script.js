document.addEventListener('DOMContentLoaded', function() {
  const content = document.querySelector('.content');
  const dashboard = document.getElementById('dashboard');
  const calmMode = document.getElementById('calm-mode');
  const toggleModeButton = document.getElementById('toggle-mode');
  const greeting = document.getElementById('greeting');
  const header = document.getElementById('header');
  const dashboardTitle = document.getElementById('dashboard-title');
  const searchBarTop = document.getElementById('search-bar-top');
  const calmTime = document.getElementById('calm-time');
  const mainFocus = document.getElementById('main-focus');
  const todoItems = document.getElementById('todo-items');

  // Check if the user's name is stored in Chrome storage
  chrome.storage.sync.get(['userName'], function(result) {
    if (result.userName) {
      greeting.textContent = `Hi, ${result.userName}`;
    } else {
      // Prompt for the user's name and save it
      const userName = prompt("Hello, what is your name?");
      if (userName) {
        chrome.storage.sync.set({ userName: userName }, function() {
          greeting.textContent = `Hi, ${userName}`;
        });
      }
    }
  });

  const sections = {
    internships: generateOpportunities('Internship'),
    competitions: generateOpportunities('Competition'),
    mentors: generateOpportunities('Mentor'),
    scholarships: generateOpportunities('Scholarship'),
    volunteer: generateOpportunities('Volunteer'),
    events: generateOpportunities('Event'),
    pomodoro: `
      <div class="pomodoro-timer">
        <h2>Pomodoro Timer</h2>
        <div class="timer-display" id="timer">25:00</div>
        <div class="timer-buttons">
          <button id="start-timer">Start</button>
          <button id="stop-timer">Stop</button>
          <button id="reset-timer">Reset</button>
        </div>
      </div>
    `
  };

  function generateOpportunities(type) {
    const opportunities = [];
    for (let i = 1; i <= 50; i++) {
      opportunities.push({
        name: `${type} ${i}`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et ipsum at velit aliquet facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et ipsum at velit aliquet facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et ipsum at velit aliquet facilisis.'
      });
    }
    return opportunities;
  }

  function loadSection(section) {
    const sectionContent = sections[section];
    if (sectionContent) {
      const namesContainer = document.querySelector('#opportunity-names-list');
      const detailsContainer = document.querySelector('#opportunity-details-content');
      namesContainer.innerHTML = '';
      detailsContainer.innerHTML = '<h2>Select an opportunity to see details</h2>';

      sectionContent.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = item.name;
        listItem.addEventListener('click', () => {
          detailsContainer.innerHTML = `<h2>${item.name}</h2><p>${item.description}</p>`;
        });
        namesContainer.appendChild(listItem);
      });
    }
  }

  document.querySelectorAll('nav ul li a').forEach(navItem => {
    navItem.addEventListener('click', function(e) {
      e.preventDefault();
      const section = navItem.getAttribute('data-section');
      loadSection(section);
    });
  });

  const searchButton = document.getElementById('search-button');
  const categoryDropdown = document.getElementById('category-dropdown');
  const searchInput = document.getElementById('search-input');

  function performSearch() {
    const category = categoryDropdown.value;
    const searchQuery = searchInput.value;
    if (category && searchQuery) {
      const searchUrls = {
        google: `https://www.google.com/search?q=${searchQuery}`,
        bing: `https://www.bing.com/search?q=${searchQuery}`,
        duckduckgo: `https://duckduckgo.com/?q=${searchQuery}`,
        yahoo: `https://search.yahoo.com/search?p=${searchQuery}`
      };
      const searchUrl = searchUrls[category];
      window.open(searchUrl, '_blank');
    } else {
      alert('Please select a search engine and enter a search term.');
    }
  }

  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Adding search suggestions using a public search suggestion API (Datamuse)
  searchInput.addEventListener('input', function() {
    const searchQuery = searchInput.value;
    if (searchQuery.length > 0) {
      fetch(`https://api.datamuse.com/sug?s=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          const suggestions = data.map(item => item.word);
          showSuggestions(suggestions);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      clearSuggestions();
    }
  });

  function showSuggestions(suggestions) {
    const suggestionBox = document.createElement('div');
    suggestionBox.id = 'suggestion-box';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.borderRadius = '8px';
    suggestionBox.style.width = `${searchInput.offsetWidth}px`;
    suggestionBox.style.top = `${searchInput.offsetTop + searchInput.offsetHeight}px`;
    suggestionBox.style.left = `${searchInput.offsetLeft}px`;
    suggestionBox.style.zIndex = '1000';
    suggestionBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = suggestion;
      suggestionItem.style.padding = '10px';
      suggestionItem.style.cursor = 'pointer';
      suggestionItem.addEventListener('click', () => {
        searchInput.value = suggestion;
        clearSuggestions();
        performSearch();
      });
      suggestionBox.appendChild(suggestionItem);
    });

    clearSuggestions();
    document.body.appendChild(suggestionBox);
  }

  function clearSuggestions() {
    const suggestionBox = document.getElementById('suggestion-box');
    if (suggestionBox) {
      suggestionBox.remove();
    }
  }

  searchInput.addEventListener('blur', clearSuggestions);

  function initPomodoroTimer() {
    let timer;
    let timeLeft = 1500; // 25 minutes in seconds
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-timer');
    const stopButton = document.getElementById('stop-timer');
    const resetButton = document.getElementById('reset-timer');

    function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
      if (!timer) {
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timer);
            timer = null;
            alert('Time is up!');
          }
        }, 1000);
      }
    }

    function stopTimer() {
      clearInterval(timer);
      timer = null;
    }

    function resetTimer() {
      stopTimer();
      timeLeft = 1500;
      updateDisplay();
    }

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    resetButton.addEventListener('click', resetTimer);

    updateDisplay();
  }

  // Toggle Calm Mode
  toggleModeButton.addEventListener('click', function() {
    if (calmMode.classList.contains('hidden')) {
      calmMode.classList.remove('hidden');
      dashboard.classList.add('hidden');
      header.classList.add('calm-mode-header');
      dashboardTitle.classList.add('hidden');
      searchBarTop.classList.remove('hidden');
      initCalmMode();
      document.body.style.backgroundImage = "url('https://od.lk/s/NDlfMzQ0Mzc0NzZf/Aurora-Wallpaper-Graphics-79790316-1.jpg')";
      toggleModeButton.textContent = 'Toggle Opportunity Mode';
    } else {
      calmMode.classList.add('hidden');
      dashboard.classList.remove('hidden');
      header.classList.remove('calm-mode-header');
      dashboardTitle.classList.remove('hidden');
      searchBarTop.classList.add('hidden');
      document.body.style.backgroundImage = "url('https://od.lk/s/NDlfMzQzOTU3NzZf/the-witcher-3-i64x6dfxkllyw0qp.jpg')";
      toggleModeButton.textContent = 'Toggle Calm Mode';
    }
    document.body.classList.toggle('calm-mode-background');
  });

  function initCalmMode() {
    updateCalmTime();
    updateCalmDate();
    initTodoList();
  }

  // Update time in calm mode
  function updateCalmTime() {
    calmTime.style.color = 'white';
    calmTime.classList.add('visible');
    let is24Hour = false;

    function updateTime() {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit' };
      const timeString = is24Hour ? now.toTimeString().slice(0, 5) : now.toLocaleTimeString([], options);
      calmTime.textContent = timeString;
    }

    calmTime.addEventListener('click', function() {
      is24Hour = !is24Hour;
      updateTime();
    });

    updateTime();
    setInterval(updateTime, 60000); // Update every minute
  }

  // Update date in calm mode
  function updateCalmDate() {
    const calmDate = document.getElementById('calm-date');
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    calmDate.textContent = now.toLocaleDateString('en-US', options);
  }

  // To-Do List functionality
  function initTodoList() {
    const todoInput = document.getElementById('new-todo');
    const todoList = document.getElementById('todo-items');

    function addTodo() {
      const todoText = todoInput.value.trim();
      if (todoText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `<button class="check-button">✔</button>${todoText}<button class="delete-button">✖</button>`;
        todoList.appendChild(li);
        todoInput.value = '';
        li.querySelector('.check-button').addEventListener('click', () => li.classList.toggle('completed'));
        li.querySelector('.delete-button').addEventListener('click', () => {
          todoList.removeChild(li);
          if (todoList.children.length === 0) {
            mainFocus.classList.remove('hidden');
          }
        });
        mainFocus.classList.add('hidden');
      }
    }

    todoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addTodo();
      }
    });

    document.querySelector('.todo-list').classList.add('visible');
  }

  // Sidebar popup functionality
  const notesIcon = document.getElementById('notes-icon');
  const backgroundIcon = document.getElementById('background-icon');
  const weatherIcon = document.getElementById('weather-icon');
  const bookmarkIcon = document.getElementById('bookmark-icon');
  const countdownIcon = document.getElementById('countdown-icon');

  notesIcon.addEventListener('click', function() {
    togglePopup('notes-popup');
  });

  backgroundIcon.addEventListener('click', function() {
    togglePopup('background-popup');
  });

  weatherIcon.addEventListener('click', function() {
    togglePopup('weather-popup');
  });

  bookmarkIcon.addEventListener('click', function() {
    togglePopup('bookmark-popup');
    loadBookmarks();
  });

  countdownIcon.addEventListener('click', function() {
    togglePopup('countdown-popup');
  });

  document.querySelectorAll('.close-popup').forEach(button => {
    button.addEventListener('click', function() {
      const popupId = button.getAttribute('data-popup');
      document.getElementById(popupId).classList.add('hidden');
    });
  });

  function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.toggle('hidden');
    popup.classList.toggle('visible');
    $(popup).draggable().resizable(); // Make the popup draggable and resizable
  }

  // Load Bookmarks
  function loadBookmarks() {
    const bookmarks = [
      { title: 'Google', url: 'https://www.google.com' },
      { title: 'Facebook', url: 'https://www.facebook.com' },
      { title: 'Twitter', url: 'https://www.twitter.com' }
    ];

    const bookmarkContent = document.getElementById('bookmark-content');
    bookmarkContent.innerHTML = ''; // Clear previous content

    bookmarks.forEach(bookmark => {
      const div = document.createElement('div');
      div.className = 'bookmark';
      div.innerHTML = `<a href="${bookmark.url}" target="_blank">${bookmark.title}</a>`;
      bookmarkContent.appendChild(div);
    });
  }

  // Countdown functionality
  const countdownList = document.getElementById('countdown-list');
  const addCountdownButton = document.getElementById('add-countdown');
  const countdownTitleInput = document.getElementById('countdown-title');
  const countdownDateInput = document.getElementById('countdown-date');

  addCountdownButton.addEventListener('click', addCountdown);

  function addCountdown() {
    const title = countdownTitleInput.value.trim();
    const date = countdownDateInput.value;
    if (title && date) {
      const li = document.createElement('li');
      li.textContent = `${title} - ${calculateDaysLeft(date)}`;
      countdownList.appendChild(li);
      countdownTitleInput.value = '';
      countdownDateInput.value = '';
    }
  }

  function calculateDaysLeft(date) {
    const eventDate = new Date(date);
    const currentDate = new Date();
    const timeDiff = eventDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return `D-${daysLeft}`;
  }

  // Initial background setup
  document.body.style.backgroundImage = "url('')";
});
