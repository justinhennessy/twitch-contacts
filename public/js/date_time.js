function timeSince(dateString) {
    if (!dateString) {
        return 'Never chatted';
    }

    const pastDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInTime = currentDate - pastDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 30) {
        return `${differenceInDays} days`;
    } else if (differenceInDays < 30 * 4) {
        const differenceInWeeks = Math.floor(differenceInDays / 7);
        return `${differenceInWeeks} weeks`;
    } else {
        const differenceInMonths = Math.floor(differenceInDays / 30);
        return `${differenceInMonths} months`;
    }
}

function formatDate(dateString) {
    if (!dateString) {
        return 'unknown';
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function sortByDateDescending(a, b) {
    const dateA = new Date(a.Date);
    const dateB = new Date(b.Date);
    return dateB - dateA;
}