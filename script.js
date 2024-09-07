document.addEventListener('DOMContentLoaded', function () {
    const kioskData = [
        { name: 'JDB', diff: -14 },
        { name: 'Joker', diff: -2 },
        { name: 'Vpower', diff: -2 },
        { name: 'JILI', diff: -2 },
        { name: 'AWC', diff: -2 },
        { name: 'ILoveU', diff: -2 },
        { name: 'UUSlot', diff: -2 },
        { name: 'Mega888', diff: -2 },
        { name: 'KA Gaming (Change to GMT+8)', diff: -2 },
        { name: 'Pussy888', diff: 0 },
        { name: 'MegaH5', diff: 0 },
        { name: '918kiss', diff: 0 },
        { name: 'DGS', diff: 0 },
        { name: 'Evo888', diff: 0 },
        { name: 'Funky', diff: 0 },
        { name: 'AAA', diff: -2 },
        { name: 'Ace333', diff: -2 },
        { name: 'NEXT SPIN', diff: -2 },
        { name: 'FASTSPIN', diff: -2 },
        { name: 'CQ9', diff: -2 },
        { name: 'A1 Imprerium', diff: -10 }
    ];

    const kioskList = document.getElementById('kiosk-list');
    const kioskSelect = $('#kiosk-select');

    // Populate table and dropdown
    kioskData.forEach(kiosk => {
        let row = `<tr><td>${kiosk.name}</td><td>${kiosk.diff >= 0 ? '+' : ''}${kiosk.diff} Hours</td></tr>`;
        kioskList.innerHTML += row;
        kioskSelect.append(new Option(kiosk.name, kiosk.diff));
    });

    kioskSelect.select2({
        placeholder: "Select a Kiosk",
        allowClear: true
    });

    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');
        const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour12: false });
        currentTimeElement.textContent = now;
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    kioskSelect.on('change', updateKioskTime);
    document.getElementById('backend-time').addEventListener('input', updateKioskTime);
    document.getElementById('backend-time').addEventListener('paste', handlePasteEvent);
    document.getElementById('date-time-picker').addEventListener('input', function () {
        document.getElementById('backend-time').value = this.value.replace('T', ' ');
        updateKioskTime();
    });

    function handlePasteEvent(event) {
        event.preventDefault();
        const pastedData = (event.clipboardData || window.clipboardData).getData('text');
        const dateTimeRegex = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/;
        const match = pastedData.match(dateTimeRegex);
        if (match) {
            const extractedDateTime = match[1];
            document.getElementById('backend-time').value = extractedDateTime;
            updateKioskTime();
        } else {
            document.getElementById('backend-time').value = pastedData;
        }
    }

    function updateKioskTime() {
        const backendTimeInput = document.getElementById('backend-time').value.trim();
        const selectedDiff = parseInt(kioskSelect.val());

        if (!backendTimeInput) {
            displayInvalidTime();
            return;
        }

        const backendDate = parseBackendTime(backendTimeInput);
        if (!backendDate) {
            displayInvalidTime();
            return;
        }

        backendDate.setHours(backendDate.getHours() + selectedDiff);
        const kioskTime24 = backendDate.toLocaleString('en-AU', { hour12: false });
        const kioskTime12 = backendDate.toLocaleString('en-AU', { hour12: true });

        document.getElementById('kiosk-time-24').textContent = kioskTime24;
        document.getElementById('kiosk-time-12').textContent = kioskTime12;
    }

    function parseBackendTime(input) {
        const parsedDate = new Date(input);
        if (!isNaN(parsedDate)) return parsedDate;

        const dateTimeParts = input.split(' ');
        if (dateTimeParts.length !== 2) return null;

        const dateParts = dateTimeParts[0].split('-');
        const timeParts = dateTimeParts[1].split(':');
        if (dateParts.length !== 3 || timeParts.length !== 3) return null;

        const [year, month, day] = dateParts.map(part => parseInt(part, 10));
        const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    function displayInvalidTime() {
        document.getElementById('kiosk-time-24').textContent = 'Invalid Time';
        document.getElementById('kiosk-time-12').textContent = 'Invalid Time';
    }

    // Sorting function
    function sortTable(columnIndex) {
        const table = document.querySelector('table tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        const direction = table.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc';
        table.setAttribute('data-sort-direction', direction);

        rows.sort((rowA, rowB) => {
            const cellA = rowA.querySelectorAll('td')[columnIndex].textContent.trim();
            const cellB = rowB.querySelectorAll('td')[columnIndex].textContent.trim();

            if (columnIndex === 1) {
                return direction === 'asc' ? parseFloat(cellA) - parseFloat(cellB) : parseFloat(cellB) - parseFloat(cellA);
            } else {
                return direction === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
            }
        });

        rows.forEach(row => table.appendChild(row));
    }

    // Bind sorting to table headers
    document.querySelectorAll('th').forEach((header, index) => {
        header.addEventListener('click', function () {
            sortTable(index);
        });
    });

    if (document.getElementById('backend-time').value) {
        updateKioskTime();
    }
});
