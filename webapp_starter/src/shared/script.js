async function getQuote() {
    const response = await fetch("/api/quote");
    const data = await response.json();
    document.getElementById("quote").textContent =
        `"${data.quote}" - ${data.author}`;
}
