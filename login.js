
document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("https://s-graphene.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("isPremium", data.isPremium);

            window.location.href = "expense.html";
        } else {
            alert(data);
        }
    } catch (err) {
        alert("Server not responding");
        console.error(err);
    }
});

function goToSignup() {
    window.location.href = "signup.html";
}
