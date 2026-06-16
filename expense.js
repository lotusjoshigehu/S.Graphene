
if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
}

const email = localStorage.getItem("userEmail");

const table = document.getElementById("expenseTable");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const expenseDate = document.getElementById("expenseDate");
const note = document.getElementById("note");
const expenseForm = document.getElementById("expenseForm");

const filterCategory = document.getElementById("filterCategory");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const totalSpent = document.getElementById("totalSpent");
const highestExpense = document.getElementById("highestExpense");
const categorySummary = document.getElementById("categorySummary");

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const rowsSelect = document.getElementById("rowsPerPageSelect");

const premiumMsg = document.getElementById("premiumMessage");
const premiumBtn = document.getElementById("premiumBtn");
const leaderboardBtn = document.getElementById("showLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboard");

const downloadBtn = document.getElementById("downloadBtn");
const downloadLink = document.getElementById("downloadLink");


let expenses = [];
let filteredExpenses = [];
let currentPage = 1;
let chart;
let editId = null;

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});


loadExpenses();

fetch(`https://s-graphene.onrender.com/user/status/${email}`)
.then(res => res.json())
.then(data => {
    if (data.isPremium) {
        premiumMsg.style.display = "block";
        premiumBtn.style.display = "none";
        leaderboardBtn.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";
    }
});

async function loadExpenses() {
    const res = await fetch(`https://s-graphene.onrender.com/expense/${email}`);//get request
    expenses = await res.json();
    filteredExpenses = [...expenses];
    renderPage();
    updateSummary();
    drawChart();
}

function editExpense(id) {

    const expense =
        expenses.find(e => e.id === id);

    amount.value = expense.amount;
    category.value = expense.category;
    expenseDate.value = expense.date;
    note.value = expense.note;

    editId = id;
}
window.editExpense = editExpense;

function renderPage() {
    table.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / rowsPerPage));
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    filteredExpenses.slice(start, end).forEach(e => {
        table.innerHTML += `
        <tr>
            <td>${formatter.format(e.amount)}</td>
            <td>${e.category}</td>
            <td>${e.date}</td>
            <td>${e.note || "-"}</td>
            <td>
               <button onclick="editExpense(${e.id})">
                    Edit
               </button>
                <button onclick="deleteExpense(${e.id})">
                    Delete
                </button>
            </td>
        </tr>`;
    });

    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
};

nextBtn.onclick = () => {
    const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
};

rowsSelect.addEventListener("change", () => {
    rowsPerPage = Number(rowsSelect.value);
    localStorage.setItem("rowsPerPage", rowsPerPage);
    currentPage = 1;
    renderPage();
});

let rowsPerPage = Number(localStorage.getItem("rowsPerPage")) || 10;
rowsSelect.value = rowsPerPage;

expenseForm.addEventListener("submit", async e => {
    e.preventDefault();

    if (amount.value <= 0) {
        alert("Amount must be positive");
        return;
    }

    if (new Date(expenseDate.value) > new Date()) {
        alert("Future date not allowed");
        return;
    }

    if (editId) {

    await fetch(
        `https://s-graphene.onrender.com/expense/${editId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: amount.value,
                category: category.value,
                date: expenseDate.value,
                note: note.value
            })
        }
    );

    editId = null;

} else {

    await fetch(
        "https://s-graphene.onrender.com/expense",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                amount: amount.value,
                category: category.value,
                date: expenseDate.value,
                note: note.value
            })
        }
    );
}
expenseForm.reset();
loadExpenses();
});

async function deleteExpense(id) {
    await fetch(`https://s-graphene.onrender.com/expense/${id}`, {
        method: "DELETE"
    });

    loadExpenses();
}

window.deleteExpense = deleteExpense;

document.getElementById("applyFilter").addEventListener("click", () => {
    filteredExpenses = expenses.filter(e => {
        const categoryMatch = !filterCategory.value || e.category === filterCategory.value;
        const startMatch = !startDate.value || e.date >= startDate.value;
        const endMatch = !endDate.value || e.date <= endDate.value;

        return categoryMatch && startMatch && endMatch;
    });

    currentPage = 1;
    renderPage();
});

document.getElementById("clearFilter").addEventListener("click", () => {
    filteredExpenses = [...expenses];
    renderPage();
});

function updateSummary() {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    totalSpent.innerText = `Total Spent : ${formatter.format(total)}`;

    const highest = expenses.length
        ? Math.max(...expenses.map(e => Number(e.amount)))
        : 0;

    highestExpense.innerText = `Highest Expense : ${formatter.format(highest)}`;

    const totals = {};

    expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });

    categorySummary.innerHTML = "";

    for (let cat in totals) {
        categorySummary.innerHTML += `
        <p>${cat}: ${formatter.format(totals[cat])}</p>`;
    }
}

function drawChart() {
    const totals = {};

    expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });

    const ctx = document.getElementById("expenseChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(totals),
            datasets: [{
                data: Object.values(totals)
            }]
        }
    });
}

leaderboardBtn.addEventListener("click", async () => {
    const res = await fetch("https://s-graphene.onrender.com/premium/showleaderboard");
    const data = await res.json();

    leaderboardList.innerHTML = "";

    data.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `${user.name} => ₹${user.totalExpense}`;
        leaderboardList.appendChild(li);
    });
});

const cashfree = Cashfree({ mode: "sandbox" });

premiumBtn.addEventListener("click", async () => {
    const res = await fetch("https://s-graphene.onrender.com/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self"
    });
});

downloadBtn.addEventListener("click", () => {
    window.location.href =
        `https://s-graphene.onrender.com/expense/download/${email}`;
});






