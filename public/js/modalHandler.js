export class ModalHandler {
    constructor(modal, modalContent) {
      this.modal = modal;
      this.modalContent = modalContent;
    }

    open() {
      this.modal.style.display = 'block';
    }

    close() {
      this.modal.style.display = 'none';
    }

    updateContent(item) {
      this.modalContent.innerHTML = '';  // Clear the existing modal content

      const journalHeader = document.createElement('h3');
      journalHeader.textContent = 'Journal';
      this.modalContent.appendChild(journalHeader);

      if (item.journal && item.journal.length > 0) {
          // Sort by date descending
          item.journal.sort((a, b) => new Date(b.date) - new Date(a.date));

          // Limit to 10 entries
          const limitedJournal = item.journal.slice(0, 10);

          limitedJournal.forEach(entry => {
              const entryPara = document.createElement('p');
              entryPara.innerHTML = `${new Date(entry.date).toLocaleDateString()}<br>${entry.entry}`;
              this.modalContent.appendChild(entryPara);
          });
      } else {
          const noEntriesPara = document.createElement('p');
          noEntriesPara.textContent = 'No journal entries available.';
          this.modalContent.appendChild(noEntriesPara);
      }

      // Add Entry button
      const addEntryButton = document.createElement('button');
      addEntryButton.textContent = '+';
      addEntryButton.style.fontSize = '24px';
      addEntryButton.style.marginTop = '10px';
      this.modalContent.appendChild(addEntryButton);

      addEntryButton.addEventListener('click', () => {
          const entryPrompt = prompt('Enter your journal entry:');
          if (entryPrompt) {
              this.addJournalEntry(item, entryPrompt);
          }
      });
    }

    async addJournalEntry(item, entry) {
        try {
            const response = await fetch('http://127.0.0.1:3000/journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: item.username,
                    entry: entry,
                }),
            });

            const data = await response.json();
            if (data.message) {
                alert(data.message);
                const newEntry = {
                    date: new Date().toISOString().split('T')[0],
                    entry: entry
                };
                item.journal.push(newEntry);
                this.close();  // Close the modal
                location.reload();  // Reload the page
            } else {
                alert('Error updating journal.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  }

