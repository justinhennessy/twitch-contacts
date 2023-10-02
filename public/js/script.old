// script.js
function createTableWithHeaders(table, includeMessageCount) {
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

document.addEventListener('DOMContentLoaded', function() {
  const appDiv = document.getElementById('app');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const span = document.querySelector('.close'); // Use querySelector to select the first matching element

  fetch('http://127.0.0.1:3000/people')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const onlineTable = document.createElement('table');
      createTableWithHeaders(onlineTable, true); // Include Message Count for "Online" table
      const onlineHeader = document.createElement('h2');
      onlineHeader.textContent = 'Online';
      appDiv.appendChild(onlineHeader);
      appDiv.appendChild(onlineTable);

      const tablesByChatterType = new Map(); // Create a map to store tables by chatter type

      data.forEach(item => {
        if (item.message_count > 0) {
          // If the person has a message_count > 0, add them to the "Online" table
          createRow(item, onlineTable, true);
        } else {
          const chatterType = item.chatter_type;

          // If the table for this chatter type doesn't exist, create it
          if (!tablesByChatterType.has(chatterType)) {
            const table = document.createElement('table');
            createTableWithHeaders(table, false); // Do not include Message Count for these tables
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
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });

  function createRow(item, table, includeMessageCount) {
    const tr = document.createElement('tr');

    // Username cell with link to open modal
    const tdUsername = document.createElement('td');
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item.username;
    link.addEventListener('click', () => {
      modal.style.display = 'block';
      modalContent.innerHTML = '';
      
      const journalHeader = document.createElement('h3');
      journalHeader.textContent = 'Journal';
      modalContent.appendChild(journalHeader);
    
      if (item.journal && item.journal.length > 0) {
        // Sort by date descending
        item.journal.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Limit to 10 entries
        const limitedJournal = item.journal.slice(0, 10);
        
        limitedJournal.forEach(entry => {
          const entryPara = document.createElement('p');
          entryPara.innerHTML = `${new Date(entry.date).toLocaleDateString()}<br>${entry.entry}`;
          modalContent.appendChild(entryPara);
        });
      } else {
        const noEntriesPara = document.createElement('p');
        noEntriesPara.textContent = 'No journal entries available.';
        modalContent.appendChild(noEntriesPara);
      }

      const addEntryButton = document.createElement('button');
      addEntryButton.textContent = '+';
      addEntryButton.style.fontSize = '24px';
      addEntryButton.style.marginTop = '10px';
      modalContent.appendChild(addEntryButton);

      attachAddEntryEventListener(addEntryButton, item);

      refreshJournalModalContent(item, false);

      addEntryButton.addEventListener('click', () => {
        const entryPrompt = prompt('Enter your journal entry:');
        if (entryPrompt) {
            fetch('http://127.0.0.1:3000/journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: item.username,
                    entry: entryPrompt,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    // Update the item.journal array and refresh the journal modal content
                    const newEntry = {
                        date: new Date().toISOString().split('T')[0],  // Get today's date in YYYY-MM-DD format
                        entry: entryPrompt
                    };
                    item.journal.push(newEntry);  // Add the new entry to the item.journal array
                    refreshJournalModalContent(item);  // Refresh the journal modal content
                } else {
                    alert('Error updating journal.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
      });

      function refreshJournalModalContent(item, addNewButton = true) {
        // ... rest of your code ...
    
        if (addNewButton) {
            // Re-add the add entry button to the modal content
            const addEntryButton = document.createElement('button');
            addEntryButton.textContent = '+';
            addEntryButton.style.fontSize = '24px';
            addEntryButton.style.marginTop = '10px';
            modalContent.appendChild(addEntryButton);
    
            attachAddEntryEventListener(addEntryButton, item);  // Re-attach the event listener
        }
      }

      function attachAddEntryEventListener(button, item) {
        button.addEventListener('click', () => {
            const entryPrompt = prompt('Enter your journal entry:');
            if (entryPrompt) {
                fetch('http://127.0.0.1:3000/journal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: item.username,
                        entry: entryPrompt,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        const newEntry = {
                            date: new Date().toISOString().split('T')[0],
                            entry: entryPrompt
                        };
                        item.journal.push(newEntry);
                        refreshJournalModalContent(item);
                    } else {
                        alert('Error updating journal.');
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
      }

      function refreshJournalModalContent(item) {
        modalContent.innerHTML = '';  // Clear the existing modal content
        
        const journalHeader = document.createElement('h3');
        journalHeader.textContent = 'Journal';
        modalContent.appendChild(journalHeader);
        
        if (item.journal && item.journal.length > 0) {
            // Sort by date descending
            item.journal.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Limit to 10 entries
            const limitedJournal = item.journal.slice(0, 10);
            
            limitedJournal.forEach(entry => {
                const entryPara = document.createElement('p');
                entryPara.innerHTML = `${new Date(entry.date).toLocaleDateString()}<br>${entry.entry}`;
                modalContent.appendChild(entryPara);
            });
        } else {
            const noEntriesPara = document.createElement('p');
            noEntriesPara.textContent = 'No journal entries available.';
            modalContent.appendChild(noEntriesPara);
        }
    
        // Re-add the add entry button to the modal content
        const addEntryButton = document.createElement('button');
        addEntryButton.textContent = '+';
        addEntryButton.style.fontSize = '24px';
        addEntryButton.style.marginTop = '10px';
        modalContent.appendChild(addEntryButton);
        
        attachAddEntryEventListener(addEntryButton, item);
      }      
    });

    tdUsername.appendChild(link);
    tr.appendChild(tdUsername);

    // Other cells
    const tdRealName = document.createElement('td');
    tdRealName.textContent = item.realName;
    tr.appendChild(tdRealName);

    const tdLocation = document.createElement('td');
    tdLocation.textContent = item.location || '-';
    tr.appendChild(tdLocation);

    const tdAspirations = document.createElement('td');
    tdAspirations.textContent = item.aspirations || '-';
    tr.appendChild(tdAspirations);

    // Conditionally add Message Count cell
    if (includeMessageCount) {
      const tdMessageCount = document.createElement('td');
      tdMessageCount.textContent = item.message_count;
      tr.appendChild(tdMessageCount);
    }

    table.appendChild(tr);
  }

  // Close modal event handlers
  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
});
