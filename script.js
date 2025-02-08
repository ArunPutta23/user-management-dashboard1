// API Source (Mock data)
const API_ENDPOINT = "https://jsonplaceholder.typicode.com/users";

// DOM Elements
const memberList = document.getElementById("memberList");
const memberFormContainer = document.getElementById("memberFormContainer");
const memberForm = document.getElementById("memberForm");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");

let members = []; // Renamed users to members

// Search Data from API (Load Members)
async function loadMembers() {
    try {
        const response = await fetch(API_ENDPOINT);
        members = await response.json();

        // Assigning a default department since API doesn't have it
        members.forEach(m => m.department = m.department || "Unassigned");

        refreshTable(); // Renamed function
    } catch (error) {
        alert("Error retrieving data. Please check your connection.");
    }
}

// Render Table with Member Data
function refreshTable() {
    memberList.innerHTML = ""; // Clear previous entries

    members.forEach(member => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name.split(" ")[0]}</td>
            <td>${member.name.split(" ")[1] || ""}</td>
            <td>${member.email}</td>
            <td>${member.department}</td>
            <td>
                <button onclick="modifyMember(${member.id})">Edit</button>
                <button onclick="removeMember(${member.id})">Delete</button>
            </td>
        `;
        memberList.appendChild(row);
    });
}

// Display Form for Adding a Member
function showMemberForm() {
    memberFormContainer.classList.remove("hidden");
}

// Hide Form After Submission or Cancel
function closeMemberForm() {
    memberFormContainer.classList.add("hidden");
    memberForm.reset();
}

// Add New Member to the List
async function addMember() {
    const firstName = document.getElementById("firstNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const email = document.getElementById("emailInput").value;
    const department = document.getElementById("deptInput").value;

    const newMember = {
        id: members.length + 1, // Generate ID manually
        name: `${firstName} ${lastName}`,
        email,
        department
    };

    members.push(newMember);
    refreshTable();
    closeMemberForm();
}

// Edit Member Details
function modifyMember(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const [firstName, lastName] = member.name.split(" ");
    document.getElementById("firstNameInput").value = firstName;
    document.getElementById("lastNameInput").value = lastName || "";
    document.getElementById("emailInput").value = member.email;
    document.getElementById("deptInput").value = member.department || "";

    memberForm.dataset.editId = id; // Store ID for updating
    showMemberForm();
}

// Update Member in List
async function updateMember(id) {
    const firstName = document.getElementById("firstNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const email = document.getElementById("emailInput").value;
    const department = document.getElementById("deptInput").value;

    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
        members[index] = {
            id,
            name: `${firstName} ${lastName}`,
            email,
            department
        };
    }

    refreshTable();
    closeMemberForm();
}

// Delete Member from the List
function removeMember(id) {
    members = members.filter(member => member.id !== id);
    refreshTable();
}

// Handle Form Submission (Add or Edit)
memberForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const editingId = memberForm.dataset.editId;
    if (editingId) {
        updateMember(parseInt(editingId));
        delete memberForm.dataset.editId; // Clear after update
    } else {
        addMember();
    }
});

// Button Event Listeners
openFormBtn.addEventListener("click", showMemberForm);
closeFormBtn.addEventListener("click", closeMemberForm);

// Load members when the page starts
loadMembers();