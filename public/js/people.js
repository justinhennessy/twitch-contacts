let people = []

function fetchPeople() {
    fetch('/people')
        .then(res => res.json())
        .then(data => {
            people = data;
            console.log(people)
            fetchMessageCounts()
        });
}