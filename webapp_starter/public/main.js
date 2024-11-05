import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

const quotes = [
    {
        quote:
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela",
    },
    {
        quote: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
    },
    {
        quote:
            "Your time is limited, so don't waste it living someone else's life.",
        author: "Steve Jobs",
    },
    {
        quote:
            "If life were predictable it would cease to be life, and be without flavor.",
        author: "Eleanor Roosevelt",
    },
    {
        quote: "If you look at what you have in life, you'll always have more.",
        author: "Oprah Winfrey",
    },
    {
        quote: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
    },
];

router.get("/api/quote", (context) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    context.response.body = randomQuote;
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
