function fetchMessageCounts() {
    fetch('/message_count')
        .then(res => res.json())
        .then(data => {
            chatters = data;
            console.log(chatters)
            displayContacts(chatters);
        });
}

function getColorBasedOnMessageCount(message_count) {
    if (message_count < 10) {
        return { color: 'lightblue', spin: false };
    } else if (message_count >= 10 && message_count < 25) {
        return { color: 'lightgreen', spin: true };
    } else if (message_count >= 25 && message_count < 50) {
        return { color: 'orange', spin: true };
    } else if (message_count >= 50 && message_count < 100) {
        return { color: 'lightcoral', spin: true };
    } else {
        return { color: 'red', spin: true };
    }
}

function calculateSphereSize(message_count) {
    const baseSize = 50;
    const maxSize = 200;
    const sizeFactor = 0.2;

    let newSize = baseSize + (message_count / sizeFactor);

    if (newSize > maxSize) {
        newSize = maxSize;
    }

    return newSize;
}