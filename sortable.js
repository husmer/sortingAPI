let superheroesData = [];
let pageSize = 20;
let currentPage = 1;
let currentSortColumn = 'name';
let sortAscending = true;

const loadData = heroes => {
    superheroesData = heroes;
    renderTable();
};

const fetchSuperheroesData = () => {
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
        .then(response => response.json())
        .then(loadData);
};

const renderTable = (dataToRender = null) => {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const data = dataToRender || superheroesData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);

    for (let i = startIndex; i < endIndex; i++) {
        const superhero = data[i]; // Заменили superheroesData на dataToRender
        const row = tableBody.insertRow();

        const iconCell = row.insertCell();
        const iconImg = document.createElement('img');
        iconImg.src = superhero.images.xs;
        iconImg.alt = superhero.name;
        iconCell.appendChild(iconImg);

        const nameCell = row.insertCell();
        nameCell.textContent = superhero.name;

        const fullNameCell = row.insertCell();
        fullNameCell.textContent = superhero.biography.fullName;

        for (const stat of ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat']) {
            const statCell = row.insertCell();
            statCell.textContent = superhero.powerstats[stat];
        }

        const raceCell = row.insertCell();
        raceCell.textContent = superhero.appearance.race;

        const genderCell = row.insertCell();
        genderCell.textContent = superhero.appearance.gender;

        const heightCell = row.insertCell();
        heightCell.textContent = superhero.appearance.height[0];

        const weightCell = row.insertCell();
        weightCell.textContent = superhero.appearance.weight[0];

        const placeOfBirthCell = row.insertCell();
        placeOfBirthCell.textContent = superhero.biography.placeOfBirth;

        const alignmentCell = row.insertCell();
        alignmentCell.textContent = superhero.biography.alignment;
    }
};


const changePageSize = () => {
    const selectedPageSize = document.getElementById('pageSize').value;

    if (selectedPageSize === 'all') {
        pageSize = superheroesData.length;
    } else {
        pageSize = parseInt(selectedPageSize);
    }

    currentPage = 1;
    renderTable();
};


const filterResults = () => {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredHeroes = superheroesData.filter(hero => hero.name.toLowerCase().includes(searchQuery));
    console.log(searchQuery)
    console.log(filteredHeroes)
    currentPage = 1;
    renderTable(filteredHeroes);
};


const sortTable = column => {
    if (currentSortColumn === column) {
        sortAscending = !sortAscending;
    } else {
        currentSortColumn = column;
        sortAscending = true;
    }
    superheroesData.sort((a, b) => {
        const valueA = getValueForColumn(a, column);
        const valueB = getValueForColumn(b, column);
        if (sortAscending) {
            return compareValues(valueA, valueB);
        } else {
            return compareValues(valueB, valueA);
        }
    });
    currentPage = 1;
    renderTable();
};

const getValueForColumn = (superhero, column) => {
    if (column === 'icon') return superhero.images.xs;
    if (column === 'fullName') return superhero.biography.fullName;
    if (column === 'race') return superhero.appearance.race;
    if (column === 'gender') return superhero.appearance.gender;
    if (column === 'height') return superhero.appearance.height[0];
    if (column === 'weight') return superhero.appearance.weight[0];
    if (column === 'placeOfBirth') return superhero.biography.placeOfBirth;
    if (column === 'alignment') return superhero.biography.alignment;

    return superhero.powerstats[column];
};

const compareValues = (valueA, valueB) => {
    if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
    } else {
        return valueA - valueB;
    }
};



const showHeroModal = (superhero) => {
    const modal = document.getElementById('heroModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <img src="${superhero.images.xs}" alt="${superhero.name}" class="hero-image">
        <h2>${superhero.name}</h2>
        <p>Full Name: ${superhero.biography.fullName}</p>
        <p>Intelligence: ${superhero.powerstats.intelligence}</p>
        <p>Strength: ${superhero.powerstats.strength}</p>
        <!-- Add more information as needed -->
        <div class="modal-footer">
            <button onclick="closeHeroModal()">Close</button>
        </div>
    `;
    modalContent.style.backgroundImage = `url('${superhero.images.xs}')`;
    modal.style.display = 'flex';
};


const closeHeroModal = () => {
    const modal = document.getElementById('heroModal');
    modal.style.display = 'none';
};

const tableBody = document.getElementById('tableBody');
tableBody.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const clickedRowIndex = clickedElement.closest('tr').rowIndex;

    if (clickedRowIndex && superheroesData[clickedRowIndex - 1]) {
        showHeroModal(superheroesData[clickedRowIndex - 1]);
    }
});

fetchSuperheroesData();