let transactions = JSON.parse(localStorage.getItem("data")) || [];

const form = document.getElementById("form");
const list = document.getElementById("list");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    // Validation
    if (title === "") {
        alert("Enter title");
        return;
    }

    if (amount === "" || isNaN(amount) || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    const transaction = {
        id: Date.now(),
        title,
        amount: +amount,
        category,
        type
    };

    transactions.push(transaction);
    localStorage.setItem("data", JSON.stringify(transactions));

    updateUI();

    form.reset();
});

function updateUI() {
    list.innerHTML = "";

    let income = 0, expense = 0;

    transactions.forEach(t => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${t.title} - ₹${t.amount}
            <button onclick="deleteTx(${t.id})">X</button>
        `;

        list.appendChild(li);

        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("income").innerText = income.toFixed(2);
    document.getElementById("expense").innerText = expense.toFixed(2);
    document.getElementById("balance").innerText = (income - expense).toFixed(2);

    updateChart();
}

function deleteTx(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("data", JSON.stringify(transactions));
    updateUI();
}

let chart;

function updateChart() {
    const categories = {};

    transactions.forEach(t => {
        if (t.type === "expense") {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories)
        }]
    };

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "pie",
        data: data
    });
}

updateUI();