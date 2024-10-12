const baseUrl = window.location.origin;

document.getElementById('addPatientForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addPatient();
});

document.getElementById('listButton').addEventListener('click', function () {
    listPatients();
});

document.getElementById('editPatientForm').addEventListener('submit', function (e) {
    e.preventDefault();
    updatePatient();
});

function showToast(message, isSuccess = true) {
    const toastElement = document.getElementById('successToast');
    const toastBody = toastElement.querySelector('.toast-body');
    
    // Update message
    toastBody.innerText = message;
    
    // Update toast background color based on success or failure
    if (isSuccess) {
        toastElement.classList.remove('text-bg-danger');
        toastElement.classList.add('text-bg-secondary'); // Neutral color for success
    } else {
        toastElement.classList.remove('text-bg-secondary');
        toastElement.classList.add('text-bg-danger'); // Red color for failure
    }
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function addPatient() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    fetch(`${baseUrl}/api/patients/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, address }),
    })
    .then(response => response.json())
    .then(data => {
        showToast('Patient added successfully!');
        document.getElementById('addPatientForm').reset();
        listPatients();
    })
    .catch((error) => {
        showToast('Failed to add patient.', false);
        console.error('Error:', error);
    });
}

function updatePatient() {
    const id = document.getElementById('editPatientId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;

    fetch(`${baseUrl}/api/patients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, address }),
    })
    .then(response => response.json())
    .then(data => {
        showToast('Patient updated successfully!');
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editPatientModal'));
        editModal.hide();
        listPatients();
    })
    .catch((error) => {
        showToast('Failed to update patient.', false);
        console.error('Error:', error);
    });
}

function deletePatient(id) {
    fetch(`${baseUrl}/api/patients/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            showToast('Patient deleted successfully!');
            listPatients();
        } else {
            throw new Error('Failed to delete patient.');
        }
    })
    .catch((error) => {
        showToast('Failed to delete patient.', false);
        console.error('Error:', error);
    });
}

function listPatients() {
    const query = document.getElementById('searchQuery').value;
    let fetchUrl = `${baseUrl}/api/patients/`;
    if (query) {
        fetchUrl = `${baseUrl}/api/patients/?name=${query}`;
    }
    fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('patientTableBody');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            showToast('No patient records found!');
            return;
        }

        data.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td>${patient.address}</td>
                <td>
                    <button class="btn btn-warning" onclick='editPatient(${JSON.stringify(patient)})'>Edit</button>
                    <button class="btn btn-danger" onclick='deletePatient(${patient.id})'>Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch((error) => {
        showToast('Failed to fetch patients.', false);
        console.error('Error:', error);
    });
}

function editPatient(patient) {
    document.getElementById('editPatientId').value = patient.id;
    document.getElementById('editName').value = patient.name;
    document.getElementById('editEmail').value = patient.email;
    document.getElementById('editPhone').value = patient.phone;
    document.getElementById('editAddress').value = patient.address;
    
    const editModal = new bootstrap.Modal(document.getElementById('editPatientModal'));
    editModal.show();
}