const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        populateWorkerSelect();
        populateScheduleTable();
    } else {
        alert('Invalid login details.');
    }
}

const data = {
    workers: [],
    shifts: []
};

function populateWorkerSelect() {
    const select = document.getElementById('workerSelect');
    const filterSelect = document.getElementById('filterWorkerSelect');

    // Clear previous options
    while (select.options.length > 0) {
        select.remove(0);
    }
    while (filterSelect.options.length > 1) {
        filterSelect.remove(1);
    }

    data.workers.forEach(worker => {
        const option = document.createElement('option');
        option.value = worker.id;
        option.textContent = worker.name;

        const filterOption = option.cloneNode(true);
        select.appendChild(option);
        filterSelect.appendChild(filterOption);
    });
}

function populateScheduleTable() {
    const table = document.getElementById('scheduleTable');

    // Clear previous rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const filterWorkerId = document.getElementById('filterWorkerSelect').value;

    data.shifts.forEach(shift => {
        if (filterWorkerId && shift.workerId != filterWorkerId) return;

        const worker = data.workers.find(w => w.id === shift.workerId);
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = worker.name;
        cell2.textContent = shift.date;
        cell3.textContent = shift.time;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() { deleteShift(shift.id); };
        cell4.appendChild(deleteButton);
    });
}

function addShift() {
    const workerId = parseInt(document.getElementById('workerSelect').value);
    const time = document.getElementById('timeInput').value;
    const date = document.getElementById('dateInput').value;

    if (!time || !date) {
        alert("Please enter a valid shift time and date.");
        return;
    }

    const existingShift = data.shifts.find(s => s.workerId === workerId && s.date === date);
    if (existingShift) {
        alert("Worker already has a shift on this date.");
        return;
    }

    const newShift = {
        id: data.shifts.length + 1,
        workerId: workerId,
        time: time,
        date: date
    };

    data.shifts.push(newShift);
    populateScheduleTable();
}

function deleteShift(shiftId) {
    const index = data.shifts.findIndex(s => s.id === shiftId);
    if (index > -1) {
        data.shifts.splice(index, 1);
    }
    populateScheduleTable();
}

function addWorker() {
    const workerName = document.getElementById('workerName').value;
    if (!workerName) {
        alert("Please enter a valid worker name.");
        return;
    }
    const newWorker = {
        id: data.workers.length + 1,
        name: workerName
    };
    data.workers.push(newWorker);
    populateWorkerSelect();
}
