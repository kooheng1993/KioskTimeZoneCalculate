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
        { name: 'KA Gaming (Change To GMT+8)', diff: -2 },
        { name: 'Pussy888', diff: 0 },
        { name: 'MegaH5', diff: 0 },
        { name: '918kiss', diff: 0 },
    ];

    // Populate the left-side table and dropdown
    const kioskList = document.getElementById('kiosk-list');
    const kioskSelect = $('#kiosk-select'); // Use jQuery for Select2 support

    kioskData.forEach(kiosk => {
        // Add to the table
        let row = `<tr><td>${kiosk.name}</td><td>${kiosk.diff >= 0 ? '+' : ''}${kiosk.diff} Hours</td></tr>`;
        kioskList.innerHTML += row;

        // Add to the select dropdown
        kioskSelect.append(new Option(kiosk.name, kiosk.diff));
    });

    // Initialize Select2 for searchable dropdown
    kioskSelect.select2({
        placeholder: "Select a Kiosk",
        allowClear: true
    });

    // Update current time every second
    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');
        const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour12: false });
        currentTimeElement.textContent = now;
    }

    updateCurrentTime(); // Initial call
    setInterval(updateCurrentTime, 1000);

    // Event Listeners
    kioskSelect.on('change', updateKioskTime);
    document.getElementById('backend-time').addEventListener('input', updateKioskTime);
    document.getElementById('backend-time').addEventListener('paste', function () {
        setTimeout(updateKioskTime, 100); // Allow paste to complete
    });
    document.getElementById('date-time-picker').addEventListener('input', function () {
        document.getElementById('backend-time').value = this.value.replace('T', ' ');
        updateKioskTime();
    });

    // Function to update Kiosk Time
    function updateKioskTime() {
        const backendTimeInput = document.getElementById('backend-time').value.trim();
        const selectedDiff = parseInt(kioskSelect.val());

        if (!backendTimeInput) {
            displayInvalidTime();
            return;
        }

        // Parse backend time
        const backendDate = parseBackendTime(backendTimeInput);
        if (!backendDate) {
            displayInvalidTime();
            return;
        }

        // Adjust time based on difference
        backendDate.setHours(backendDate.getHours() + selectedDiff);

        // Display in 24-hour and 12-hour formats
        const kioskTime24 = backendDate.toLocaleString('en-AU', { hour12: false });
        const kioskTime12 = backendDate.toLocaleString('en-AU', { hour12: true });

        document.getElementById('kiosk-time-24').textContent = kioskTime24;
        document.getElementById('kiosk-time-12').textContent = kioskTime12;
    }

    // Function to parse backend time input
    function parseBackendTime(input) {
        // Attempt to parse the input as a valid date
        const parsedDate = new Date(input);
        if (!isNaN(parsedDate)) {
            return parsedDate;
        }

        // Attempt to parse the input manually (e.g., "2024-09-07 15:30:03")
        const dateTimeParts = input.split(' ');
        if (dateTimeParts.length !== 2) return null;

        const dateParts = dateTimeParts[0].split('-');
        const timeParts = dateTimeParts[1].split(':');

        if (dateParts.length !== 3 || timeParts.length !== 3) return null;

        const [year, month, day] = dateParts.map(part => parseInt(part, 10));
        const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    // Function to display invalid time message
    function displayInvalidTime() {
        document.getElementById('kiosk-time-24').textContent = 'Invalid Time';
        document.getElementById('kiosk-time-12').textContent = 'Invalid Time';
    }

    // Initial calculation if backend time is pre-filled
    if (document.getElementById('backend-time').value) {
        updateKioskTime();
    }
});
