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
    return tdLocation;
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
