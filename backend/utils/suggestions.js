const getSeasonalSuggestions = () => {
    const month = new Date().getMonth();
    const seasonalMap = {
        0: ["Hot Chocolate", "Soup", "Cocoa"],
        1: ["Soup", "Tea", "Bread"],
        2: ["Salad", "Herbs", "Oranges"],
        3: ["Watermelon", "Sunscreen", "Lemonade"]
    };

    return seasonalMap[Math.floor(month / 3)] || ["Fresh Herbs", "Sparkling Water", "Fruit Salad"];
};

const buildSuggestions = (items = []) => {
    const names = items.map((item) => item.name?.toLowerCase() || "");
    const suggestions = [];

    if (names.some((name) => name.includes("milk") || name.includes("cream"))) {
        suggestions.push({ name: "Almond Milk", category: "Dairy", reason: "A popular dairy-free substitute" });
    }
    if (names.some((name) => name.includes("bread") || name.includes("toast"))) {
        suggestions.push({ name: "Butter", category: "Bakery", reason: "Bread pairs well with butter" });
    }
    if (names.some((name) => name.includes("fruit") || name.includes("apple") || name.includes("banana"))) {
        suggestions.push({ name: "Granola", category: "Breakfast", reason: "Fruit is often paired with granola" });
    }
    if (names.some((name) => name.includes("water"))) {
        suggestions.push({ name: "Sparkling Water", category: "Drinks", reason: "Water was already on your list" });
    }

    getSeasonalSuggestions().forEach((name) => {
        suggestions.push({ name, category: "Seasonal", reason: "Seasonal favorite" });
    });

    return suggestions.slice(0, 6);
};

module.exports = { buildSuggestions };