// Importing the ModalHandler class
import { ModalHandler } from './modalHandler.js';

// Initializing the modalHandler
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalHandler = new ModalHandler(modal, modalContent);

export function createTableWithHeaders(table, includeMessageCount) {
    const headers = ['Username', 'Real Name', 'Location', 'Aspirations'];
    if (includeMessageCount) headers.push('Message Count');
    const tr = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tr.appendChild(th);
    });
    table.appendChild(tr);
}

export function createRow(item, table, includeMessageCount) {
    const tr = document.createElement('tr');
    tr.appendChild(createUsernameCell(item));
    tr.appendChild(createRealNameCell(item));
    tr.appendChild(createLocationCell(item));
    tr.appendChild(createAspirationsCell(item));
    if (includeMessageCount) {
      tr.appendChild(createMessageCountCell(item));
    }
    table.appendChild(tr);
}

function createUsernameCell(item) {
    const tdUsername = document.createElement('td');
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item.username;
    link.addEventListener('click', () => {
        modalHandler.open();
        modalHandler.updateContent(item);
    });
    tdUsername.appendChild(link);
    return tdUsername;
}

function createRealNameCell(item) {
    const tdRealName = document.createElement('td');
    tdRealName.textContent = item.realName;
    return tdRealName;
}

function createLocationCell(item) {
    const tdLocation = document.createElement('td');
    tdLocation.textContent = item.location || '-';
    if (item.location) {
        const timeZone = getTimeZone(item.location);
        if (timeZone) {
            const currentTime = moment.tz(timeZone).format('LLLL');
            tippy(tdLocation, {
                content: `${currentTime}`,
            });
        }
    }
    return tdLocation;
}

function getTimeZone(location) {
    const locationToTimeZone = {
        'New York': 'America/New_York',
        'London': 'Europe/London',
        'Brighton, England': 'Europe/London', // Assuming Brighton follows the same timezone as London
        'UK': 'Europe/London',
        'East Coast USA, Carolinas': 'America/New_York', // Assuming the time zone for the Carolinas is the same as New York
        'Hong Kong': 'Asia/Hong_Kong',
        'France': 'Europe/Paris',
        'Canada': 'America/Toronto', // Note: Canada spans multiple time zones; this is just one example
        'California': 'America/Los_Angeles',
        'Brisbane': 'Australia/Brisbane',
        'Denmark': 'Europe/Copenhagen',
        'New Zealand': 'Pacific/Auckland',
        // ... other locations
    };
    return locationToTimeZone[location];
}

function createAspirationsCell(item) {
    const tdAspirations = document.createElement('td');
    tdAspirations.textContent = item.aspirations || '-';
    return tdAspirations;
}

function createMessageCountCell(item) {
    const tdMessageCount = document.createElement('td');
    tdMessageCount.textContent = item.message_count;
    return tdMessageCount;
}
