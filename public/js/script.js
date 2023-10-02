// Importing necessary modules and functions
import { createTableWithHeaders, createRow } from './elementCreation.js';
import { fetchData } from './dataHandler.js';
import { ModalHandler } from './modalHandler.js';
import { attachEventHandlers } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', async function() {
  const appDiv = document.getElementById('app');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');

  // Create an instance of ModalHandler
  const modalHandler = new ModalHandler(modal, modalContent);
  attachEventHandlers(modalHandler);  // Attach event handlers for closing the modal

  const data = await fetchData('http://127.0.0.1:3000/people');  // Fetch the data
  if (data) {
    const onlineTable = document.createElement('table');
    createTableWithHeaders(onlineTable, true);  // Include Message Count for "Online" table
    const onlineHeader = document.createElement('h2');
    onlineHeader.textContent = 'Online';
    appDiv.appendChild(onlineHeader);
    appDiv.appendChild(onlineTable);

    const tablesByChatterType = new Map();  // Create a map to store tables by chatter type

    data.forEach(item => {
      if (item.message_count > 0) {
        // If the person has a message_count > 0, add them to the "Online" table
        createRow(item, onlineTable, true);
      } else {
        const chatterType = item.chatter_type;
        // If the table for this chatter type doesn't exist, create it
        if (!tablesByChatterType.has(chatterType)) {
          const table = document.createElement('table');
          createTableWithHeaders(table, false);  // Do not include Message Count for these tables
          tablesByChatterType.set(chatterType, table);

          // Create a header for this table
          const typeHeader = document.createElement('h2');
          typeHeader.textContent = chatterType.charAt(0).toUpperCase() + chatterType.slice(1);
          appDiv.appendChild(typeHeader);
          appDiv.appendChild(table);
        }
        // Create a row for the person in the appropriate table
        createRow(item, tablesByChatterType.get(chatterType), false);
      }
    });
  } else {
    console.error('Data could not be fetched');
  }
});
