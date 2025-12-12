// ==============================
// NCOM Notion Integration Script
// ==============================

// 1️⃣ Replace these with your own
const NOTION_PAGE_ID = "2c7c58472f5e8033b093e7215e3ef2b6"; // Your Notion page ID
const NOTION_API_KEY = "YOUR_NOTION_API_TOKEN"; // never commit the real token

// 2️⃣ Helper to fetch Notion blocks
async function fetchNotionBlocks(pageId) {
    try {
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (err) {
        console.error("Error fetching Notion blocks:", err);
        return null;
    }
}

// 3️⃣ Map block data to website sections
function mapBlocksToSections(blocks) {
    if (!blocks || !blocks.results) return;

    // Headline & Subtext mapping
    const headline1 = blocks.results.find(b => b.type === "heading_1")?.heading_1?.rich_text[0]?.plain_text;
    const subtext1 = blocks.results.find(b => b.type === "paragraph")?.paragraph?.rich_text[0]?.plain_text;

    const headline2 = blocks.results[2]?.heading_1?.rich_text[0]?.plain_text || "Innovation for Everyone";
    const subtext2 = blocks.results[3]?.paragraph?.rich_text[0]?.plain_text || "Default subtext";

    const headline3 = blocks.results[4]?.heading_1?.rich_text[0]?.plain_text || "Secure and Reliable";
    const subtext3 = blocks.results[5]?.paragraph?.rich_text[0]?.plain_text || "Default subtext";

    document.getElementById("headline1").textContent = headline1 || "We Empower the World";
    document.getElementById("subtext1").textContent = subtext1 || "NCOM isn’t afraid to be different. We innovate boldly, taking risks to create technologies that empower people and organizations globally.";

    document.getElementById("headline2").textContent = headline2;
    document.getElementById("subtext2").textContent = subtext2;

    document.getElementById("headline3").textContent = headline3;
    document.getElementById("subtext3").textContent = subtext3;

    // Play-ground items (assumes child pages or headings)
    const playgroundContainer = document.getElementById("playground-container");
    playgroundContainer.innerHTML = ""; // clear first
    blocks.results
        .filter(b => b.type === "child_page" || b.type === "heading_2")
        .forEach(block => {
            if (block.type === "child_page" && block.child_page.title.includes("Play-ground")) {
                const div = document.createElement("div");
                div.textContent = block.child_page.title;
                playgroundContainer.appendChild(div);
            } else if (block.type === "heading_2" && block.heading_2.rich_text[0]?.plain_text.includes("Play-ground")) {
                const div = document.createElement("div");
                div.textContent = block.heading_2.rich_text[0].plain_text;
                playgroundContainer.appendChild(div);
            }
        });

    // News items (assumes child pages or headings)
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";
    blocks.results
        .filter(b => b.type === "child_page" || b.type === "heading_2")
        .forEach(block => {
            if (block.type === "child_page" && block.child_page.title.includes("News")) {
                const div = document.createElement("div");
                div.textContent = block.child_page.title;
                newsContainer.appendChild(div);
            } else if (block.type === "heading_2" && block.heading_2.rich_text[0]?.plain_text.includes("News")) {
                const div = document.createElement("div");
                div.textContent = block.heading_2.rich_text[0].plain_text;
                newsContainer.appendChild(div);
            }
        });
}

// 4️⃣ Initialize
async function loadNotionContent() {
    const data = await fetchNotionBlocks(NOTION_PAGE_ID);
    mapBlocksToSections(data);
}

// 5️⃣ Run on page load
document.addEventListener("DOMContentLoaded", loadNotionContent);
