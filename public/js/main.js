const contactList = document.getElementById('contact-list');
let chatters = {}

function displayContacts(chatters) {
  contactList.innerHTML = '';

  for (const person of people) {
    const username = person.username;
    if (chatters.hasOwnProperty(username)) {
      person.message_count = chatters[username];
    }
  }

  console.log(people)

  function logChange(people) {
    fetch('/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: people })
    })
      .then(response => console.log('Data logged to server:', response))
      .catch(error => console.error('Error logging data to server:', error));
  }

  function formattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  function calculateDarkerColor(startColor, darknessFactor) {
    // Convert hexadecimal color to RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    }
  
    // Convert RGB color to hexadecimal
    function rgbToHex(r, g, b) {
      const rgb = (r << 16) | (g << 8) | b;
      return "#" + (0x1000000 + rgb).toString(16).slice(1);
    }
  
    // Calculate darker color
    function darkenColor(rgb, factor) {
      return rgb.map(value => Math.max(0, Math.floor(value * factor)));
    }
  
    const startRgb = hexToRgb(startColor);
    const endRgb = darkenColor(startRgb, darknessFactor);
    const endColor = rgbToHex(...endRgb);
  
    return { startColor, endColor };
  }  

  class Person {
    constructor(username, realName, location = '', chatter_type = 'unknown', interaction_count = 0, aspirations = '', song_requests = [], journal = [], message_count = 0) {
      this.username = username;
      this.realName = realName;
      this.location = location;
      this.chatter_type = chatter_type;
      this.interaction_count = interaction_count;
      this.aspirations = aspirations;
      this.song_requests = song_requests;
      this.message_count = message_count;
      this.journal = journal;
    }
  }
  
  function addPersonIfNotExists(newPerson, peopleArray) {
    const personIndex = peopleArray.findIndex(person => person.username === newPerson.username);

    if (personIndex === -1) {
        peopleArray.push(newPerson);
        logChange(people);
    }
  }

  for (const username in chatters) {
    const newItem = { username: username, chatter_type: 'unknown' };
    addPersonIfNotExists(newItem, people);
  }

  people.filter(person => chatters.hasOwnProperty(person.username))
    .forEach(person => {
      const personElement = createPersonElement(person);
      contactList.appendChild(personElement);

      const sphere = personElement.querySelector('.sphere');
      const details = personElement.querySelector('.details');

      sphere.addEventListener('click', function () {
        const clicked_chatter = details.textContent;
        const person = people.find(obj => obj.username === clicked_chatter);

        if (person) {
          switch (person.chatter_type) {
            case 'unknown':
              person.chatter_type = 'known';
              person.first_chatted = formattedDate();
              logChange(people);
              displayContacts(chatters);
              break;
            case 'known':
              person.interaction_count = !isNaN(person.interaction_count) ? ++person.interaction_count : 1;
              logChange(people);
              break;
            default:
              break;
          }
        }
      });

      if (person.chatter_type == 'known') {
        person.last_chatted = formattedDate();
      }

      const animationWrapper = document.createElement('div');
      animationWrapper.className = 'animation-wrapper';
      sphere.appendChild(animationWrapper);

      const newSize = calculateSphereSize(person.message_count);
      sphere.style.width = newSize + "px";
      sphere.style.height = newSize + "px";

      const colorInfo = calculateDarkerColor(getSphereColor(person.chatter_type), 2 );
      sphere.style.background = `linear-gradient(to bottom right, ${colorInfo.startColor}, ${colorInfo.endColor})`;

      const messageCount = document.createElement('span');
      messageCount.textContent = person.message_count;
      messageCount.style.position = 'absolute';
      messageCount.style.top = '50%';
      messageCount.style.left = '50%';
      messageCount.style.transform = 'translate(-50%, -50%)';
      sphere.appendChild(messageCount);

      details.style.display = 'flex';
      details.style.flexDirection = 'column';
    })
};

fetchPeople();

fetchMessageCounts();

setInterval(fetchMessageCounts, 10000);