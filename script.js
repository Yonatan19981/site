const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // You should never hardcode passwords like this in a real system

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
    workers: [
        
    ],
    shifts: [
      
    ]
};

function populateWorkerSelect() {
    const select = document.getElementById('workerSelect');
    data.workers.forEach(worker => {
        const option = document.createElement('option');
        option.value = worker.id;
        option.textContent = worker.name;
        select.appendChild(option);
    });
}

function populateScheduleTable() {
    const table = document.getElementById('scheduleTable');
    data.shifts.forEach(shift => {
        const worker = data.workers.find(w => w.id === shift.workerId);
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = worker.name;
        cell2.textContent = shift.date;
        cell3.textContent = shift.time;
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

    const newShift = {
        id: data.shifts.length + 1,
        workerId: workerId,
        time: time,
        date: date
    };

    data.shifts.push(newShift);
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
