import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import ShoppingForm from "../components/ShoppingForm";
import ShoppingList from "../components/ShoppingList";
import SuggestionPanel from "../components/SuggestionPanel";
import TranscriptBox from "../components/TranscriptBox";
import VoiceButton from "../components/VoiceButton";
import defaultProducts from "../data/products";

function Home() {
    const [items, setItems] = useState([]);
    const [command, setCommand] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusMessage, setStatusMessage] = useState("Say or type a command such as 'Add milk' or 'Find organic apples'.");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [language, setLanguage] = useState("en-US");
    const [suggestions, setSuggestions] = useState([]);
    const [availableProducts] = useState(defaultProducts);
    const [shoppingHistory, setShoppingHistory] = useState(() => {
        if (typeof window === "undefined") return [];
        try {
            const savedHistory = localStorage.getItem("shopping-history");
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });
    const [isVoiceSearchListening, setIsVoiceSearchListening] = useState(false);
    const recognitionRef = useRef(null);
    const searchRecognitionRef = useRef(null);

    const fetchItems = async () => {
        try {
            const response = await api.get("/items");
            setItems(response.data || []);
        } catch (error) {
            console.error(error);
            setError("Unable to load the list right now.");
        }
    };

    const fetchSuggestions = (currentItems = items) => {
        const nextSuggestions = buildSmartSuggestions(currentItems);
        setSuggestions(nextSuggestions);
    };

    const buildSmartSuggestions = (currentItems) => {
        const itemNames = currentItems.map((item) => normalizeText(item.name));
        const suggestions = [];
        const seenProducts = new Set();

        const addSuggestion = (product, reason, allowDuplicate = false) => {
            const productKey = normalizeText(product.name);
            const alreadyInList = itemNames.some((name) => productKey.includes(name) || name.includes(productKey));
            if (!allowDuplicate && alreadyInList) return;
            if (seenProducts.has(productKey)) return;

            seenProducts.add(productKey);
            suggestions.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                reason
            });
        };

        const lowStockProduct = currentItems.find((item) => {
            const normalizedName = normalizeText(item.name);
            if (!normalizedName.includes("bread")) return false;
            const quantity = Number(item.quantity);
            return !Number.isNaN(quantity) && quantity <= 1;
        });

        if (lowStockProduct) {
            const breadProduct = availableProducts.find((product) => normalizeText(product.name).includes("bread"));
            if (breadProduct) {
                addSuggestion(breadProduct, "It looks like you're running low on bread.", true);
            }
        }

        const previousProduct = [...shoppingHistory].reverse().find((entry) => availableProducts.some((product) => normalizeText(product.name) === normalizeText(entry)));
        if (previousProduct) {
            const productMatch = availableProducts.find((product) => normalizeText(product.name) === normalizeText(previousProduct));
            if (productMatch) {
                const relatedProduct = availableProducts.find((product) => {
                    return product.category === productMatch.category && normalizeText(product.name) !== normalizeText(productMatch.name);
                });
                if (relatedProduct) {
                    addSuggestion(relatedProduct, `Based on your previous picks, ${relatedProduct.name} fits your usual routine.`);
                }
            }
        }

        if (itemNames.some((name) => name.includes("milk"))) {
            const substitute = availableProducts.find((product) => normalizeText(product.name).includes("almond milk"));
            if (substitute) {
                addSuggestion(substitute, "A dairy-free substitute for milk.");
            }
        }

        if (itemNames.some((name) => name.includes("bread"))) {
            const pairing = availableProducts.find((product) => normalizeText(product.name).includes("butter"));
            if (pairing) {
                addSuggestion(pairing, "Often paired with bread.");
            }
        }

        const month = new Date().getMonth();
        let seasonalProducts = [];
        if (month >= 2 && month <= 4) {
            seasonalProducts = ["tomatoes", "yogurt"];
        } else if (month >= 5 && month <= 7) {
            seasonalProducts = ["water", "tomatoes"];
        } else if (month >= 8 && month <= 10) {
            seasonalProducts = ["coffee", "rice"];
        } else {
            seasonalProducts = ["coffee", "chicken breast"];
        }

        seasonalProducts.forEach((productName) => {
            const product = availableProducts.find((entry) => normalizeText(entry.name).includes(productName));
            if (product) {
                addSuggestion(product, "Seasonal recommendation for this time of year.");
            }
        });

        return suggestions.slice(0, 6);
    };

    useEffect(() => {
        fetchItems();
        fetchSuggestions(items);
        return () => recognitionRef.current?.stop();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("shopping-history", JSON.stringify(shoppingHistory));
        }
    }, [shoppingHistory]);

    useEffect(() => {
        if (items.length) {
            fetchSuggestions(items);
        } else {
            setSuggestions([]);
        }
    }, [items]);
    const inferCategory = (name) => {
        const normalized = name.toLowerCase();
        if (/milk|cheese|yogurt|butter|cream|egg/i.test(normalized)) return "Dairy";
        if (/apple|banana|orange|grape|tomato|lettuce|carrot|potato|onion|fruit|vegetable/i.test(normalized)) return "Produce";
        if (/bread|cookie|cereal|snack|chocolate|cracker/i.test(normalized)) return "Pantry";
        if (/soap|shampoo|toothpaste|detergent/i.test(normalized)) return "Household";
        return "Others";
    };

    const inferUnit = (name) => {
        const normalized = name.toLowerCase();
        if (/bottle|water|juice|milk|soda/i.test(normalized)) return "bottle";
        if (/bag|rice|flour|cereal/i.test(normalized)) return "bag";
        if (/box|cereal|cookies/i.test(normalized)) return "box";
        return "pcs";
    };

    const normalizeText = (value) => value?.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim() || "";

    const findCatalogProduct = (input) => {
        const normalizedInput = normalizeText(input);
        if (!normalizedInput) return null;

        return availableProducts.find((product) => {
            const productName = normalizeText(product.name);
            const aliasMatch = (product.aliases || []).some((alias) => normalizeText(alias) === normalizedInput || normalizedInput.includes(normalizeText(alias)) || normalizeText(alias).includes(normalizedInput));
            const searchText = [productName, product.category, product.brand, product.size, product.description].map(normalizeText).join(" ");
            return productName === normalizedInput || searchText.includes(normalizedInput) || aliasMatch;
        }) || null;
    };

    const parseItemDetails = (rawText) => {
        const text = rawText.trim();
        const normalizedText = text.toLowerCase();
        const quantityMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
        const quantityMatch = text.match(/(\d+)/);
        const quantityWordMatch = text.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
        const quantity = quantityMatch ? Number(quantityMatch[1]) : quantityWordMatch ? quantityMap[quantityWordMatch[1].toLowerCase()] : 1;

        const brandMatch = text.match(/\b(organic|vegan|gluten-free|low-sugar|premium|store-brand|generic)\b/i);
        const sizeMatch = text.match(/\b(\d+\s?(ml|l|kg|g|oz|lb|cm|inch|inches)|small|medium|large|family|jumbo|mini|regular)\b/i);
        const priceMatch = text.match(/under\s*\$?(\d+(?:\.\d{1,2})?)|\$?(\d+(?:\.\d{1,2})?)\s*(or|and)\s*\$?(\d+(?:\.\d{1,2})?)/i);
        const price = priceMatch ? Number(priceMatch[1] || priceMatch[2] || 0) : null;
        const unitMatch = text.match(/\b(kg|g|ml|l|oz|lb|pcs?|bottles?|boxes?|packs?|units?)\b/i);
        const unit = unitMatch ? unitMatch[1].toLowerCase() : "pcs";

        const cleaned = text
            .replace(/^(add|buy|purchase|need|i need|i want|i want to buy|i need to buy|put|include|agrega|añade|comprar|necesito|quiero|quiero comprar|pon|incluye)\s+/i, "")
            .replace(/\b(to|from|my|the|list|on|into|in)\b/gi, " ")
            .replace(/\b\d+\b/g, "")
            .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/gi, "")
            .replace(/\b(bottles?|boxes?|packs?|kg|g|lbs?|pcs?|units?|of|a|an)\b/gi, "")
            .replace(/\b(organic|vegan|gluten-free|low-sugar|premium|store-brand|generic)\b/gi, "")
            .replace(/\b(under|between|and|or)\b/gi, "")
            .replace(/\$(\d+(?:\.\d{1,2})?)/g, "")
            .replace(/\s+/g, " ")
            .trim();

        const name = cleaned || (normalizedText.includes("toothpaste") ? "Toothpaste" : "Item");
        const notes = [];
        if (brandMatch) notes.push(`brand:${brandMatch[1]}`);
        if (sizeMatch) notes.push(`size:${sizeMatch[0]}`);
        if (price) notes.push(`max-price:${price}`);

        return {
            quantity,
            name,
            brand: brandMatch ? brandMatch[1] : "",
            size: sizeMatch ? sizeMatch[0] : "",
            price: price || 0,
            notes: notes.join(" | "),
            unit
        };
    };

    const processCommand = async (rawText) => {
        if (!rawText?.trim()) return;

        setIsLoading(true);
        setError("");
        setStatusMessage("Processing command...");

        const text = rawText.trim();
        const normalized = text.toLowerCase();

        try {
            const removeMatch = normalized.match(/^(remove|delete|eliminate|take out|quit|quitar|borrar|sacar|elimínate|eliminar)\b/i);
            if (removeMatch) {
                const itemName = text.replace(removeMatch[0], "").replace(/^(from|my|the|list|on|in)/i, "").trim();
                const match = items.find((item) => item.name.toLowerCase().includes(itemName.toLowerCase()));
                if (!match) {
                    setError(`No matching item found for "${itemName || "that item"}".`);
                    setIsLoading(false);
                    return;
                }
                await api.delete(`/items/${match._id}`);
                setItems((currentItems) => currentItems.filter((item) => item._id !== match._id));
                setStatusMessage(`Removed ${match.name}.`);
                setCommand("");
                setTranscript(text);
                setIsLoading(false);
                return;
            }

            const searchMatch = normalized.match(/^(find|search|look for|buscar|encuentra|ver|revisar)\b/i);
            if (searchMatch) {
                const query = text.replace(searchMatch[0], "").replace(/^(for|me|the|my|list)/i, "").trim();
                setSearchQuery(query);
                setStatusMessage(query ? `Showing matches for "${query}".` : "Showing your current list.");
                setCommand("");
                setTranscript(text);
                setIsLoading(false);
                return;
            }

            const modifyMatch = normalized.match(/^(change|update|replace|swap|modify|cambiar|actualizar|reemplazar|cambia)\b/i);
            if (modifyMatch) {
                const parts = text.split(/\b(to|with|for|and)\b/i);
                const originalName = parts[0].replace(modifyMatch[0], "").trim();
                const newName = parts[1] ? parts.slice(1).join(" ").trim() : "";
                const match = items.find((item) => item.name.toLowerCase().includes(originalName.toLowerCase()));
                if (!match || !newName) {
                    setError("Please say a clear change such as 'change milk to almond milk'.");
                    setIsLoading(false);
                    return;
                }
                const response = await api.put(`/items/${match._id}`, { name: newName, category: inferCategory(newName) });
                setItems((currentItems) => currentItems.map((item) => item._id === match._id ? response.data.data || response.data : item));
                setStatusMessage(`Updated ${match.name} to ${newName}.`);
                setCommand("");
                setTranscript(text);
                setIsLoading(false);
                return;
            }

            const { quantity, name, brand, size, price, notes, unit } = parseItemDetails(text);
            const catalogMatch = findCatalogProduct(name);

            if (!catalogMatch) {
                const fallbackSuggestion = availableProducts.find((product) => normalizeText(product.name).includes(normalizeText(name)) || normalizeText(name).includes(normalizeText(product.name)));
                if (fallbackSuggestion) {
                    setStatusMessage(`"${name}" was not found exactly, but ${fallbackSuggestion.name} looks like a close match.`);
                    setCommand("");
                    setTranscript(text);
                    setIsLoading(false);
                    return;
                }
                setError(`"${name}" is not in the available products list.`);
                setCommand("");
                setTranscript(text);
                setIsLoading(false);
                return;
            }

            const payload = {
                name: catalogMatch.name,
                quantity,
                category: catalogMatch.category,
                unit: unit || inferUnit(catalogMatch.name),
                brand: catalogMatch.brand,
                size: catalogMatch.size,
                price: catalogMatch.price,
                notes: `${notes || ""}${notes ? " | " : ""}catalog:${catalogMatch.id}`,
                completed: false
            };

            try {
                const response = await api.post("/items", payload);
                const nextItems = [response.data, ...items];
                setItems(nextItems);
                setShoppingHistory((currentHistory) => {
                    const nextHistory = [...currentHistory];
                    if (!nextHistory.some((entry) => normalizeText(entry) === normalizeText(catalogMatch.name))) {
                        nextHistory.push(catalogMatch.name);
                    }
                    return nextHistory;
                });
                fetchSuggestions(nextItems);
                setStatusMessage(`Added ${quantity} ${payload.unit} ${catalogMatch.name} from the product catalog.`);
            } catch (error) {
                console.error(error);
                const nextItems = [{ ...payload, _id: `${Date.now()}` }, ...items];
                setItems(nextItems);
                setShoppingHistory((currentHistory) => {
                    const nextHistory = [...currentHistory];
                    if (!nextHistory.some((entry) => normalizeText(entry) === normalizeText(catalogMatch.name))) {
                        nextHistory.push(catalogMatch.name);
                    }
                    return nextHistory;
                });
                fetchSuggestions(nextItems);
                setStatusMessage(`Added ${quantity} ${payload.unit} ${catalogMatch.name} to the shopping list.`);
            }
            setCommand("");
            setTranscript(text);
        } catch (error) {
            console.error(error);
            setError("The command could not be completed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Voice recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const finalText = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join(" ");
            setTranscript(finalText);
            setCommand(finalText);
            setIsListening(false);
            void processCommand(finalText);
        };
        recognition.onerror = (event) => {
            setError(`Voice input error: ${event.error}`);
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
    };

    const handleVoiceSearch = () => {
        if (isVoiceSearchListening) {
            searchRecognitionRef.current?.stop();
            setIsVoiceSearchListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Voice search is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setIsVoiceSearchListening(true);
        recognition.onresult = (event) => {
            const finalText = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join(" ");
            const cleanedQuery = finalText.replace(/^(find|search|look for|buscar|encuentra|ver|revisar)\s+/i, "").trim();
            setTranscript(finalText);
            setSearchQuery(cleanedQuery);
            setStatusMessage(cleanedQuery ? `Showing matches for "${cleanedQuery}".` : "Showing your current list.");
            setIsVoiceSearchListening(false);
        };
        recognition.onerror = (event) => {
            setError(`Voice search error: ${event.error}`);
            setIsVoiceSearchListening(false);
        };
        recognition.onend = () => setIsVoiceSearchListening(false);
        searchRecognitionRef.current = recognition;
        recognition.start();
    };

    const handleToggleComplete = async (item) => {
        try {
            const response = await api.put(`/items/${item._id}`, { completed: !item.completed });
            setItems((currentItems) => currentItems.map((currentItem) => currentItem._id === item._id ? response.data.data || response.data : currentItem));
        } catch (error) {
            console.error(error);
            setError("Unable to update the item right now.");
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await api.delete(`/items/${itemId}`);
            setItems((currentItems) => currentItems.filter((item) => item._id !== itemId));
        } catch (error) {
            console.error(error);
            setError("Unable to delete the item right now.");
        }
    };

    const handleSuggestion = async (suggestionName) => {
        await processCommand(`Add ${suggestionName}`);
    };

    const handleAddFromCatalog = async (product) => {
        await processCommand(`Add ${product.name}`);
    };

    const visibleProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return availableProducts;

        return availableProducts.filter((product) => {
            const searchValues = [product.name, product.category, product.brand, product.size, product.description, ...(product.aliases || [])];
            return searchValues.some((value) => normalizeText(value).includes(query));
        });
    }, [availableProducts, searchQuery]);

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return items;

        const priceMatch = query.match(/under\s*\$?(\d+(?:\.\d{1,2})?)|less\s+than\s*\$?(\d+(?:\.\d{1,2})?)|between\s*\$?(\d+(?:\.\d{1,2})?)\s*(and|to)\s*\$?(\d+(?:\.\d{1,2})?)/i);
        const maxPrice = priceMatch ? Number(priceMatch[1] || priceMatch[2] || 0) : null;
        const minPrice = priceMatch && priceMatch[3] ? Number(priceMatch[3]) : null;
        const maxPrice2 = priceMatch && priceMatch[5] ? Number(priceMatch[5]) : null;

        return items.filter((item) => {
            const searchableValues = [
                item.name,
                item.category,
                item.unit,
                item.brand,
                item.size,
                item.notes,
                item.price ? `$${item.price}` : ""
            ];

            const matchesText = searchableValues.some((value) => value?.toString().toLowerCase().includes(query));
            const matchesPrice = maxPrice ? Number(item.price || 0) <= maxPrice : minPrice && maxPrice2 ? Number(item.price || 0) >= minPrice && Number(item.price || 0) <= maxPrice2 : true;
            const matchesBrand = query.includes("organic") ? (item.brand || "").toLowerCase().includes("organic") : true;

            return matchesText && matchesPrice && matchesBrand;
        });
    }, [items, searchQuery]);

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.card}>
                <div style={styles.heroSection}>
                    <div>
                        <p style={styles.eyebrow}>Voice-first shopping assistant</p>
                        <h2 style={styles.title}>Add items, search fast, and keep your list organized.</h2>
                        <p style={styles.subtitle}>Use your voice or type a command, then let the app categorize, suggest, and manage the list for you.</p>
                    </div>
                    <VoiceButton onClick={toggleListening} isListening={isListening} />
                </div>

                <ShoppingForm
                    command={command}
                    setCommand={setCommand}
                    onSubmit={(event) => {
                        event.preventDefault();
                        void processCommand(command);
                    }}
                    onVoiceToggle={toggleListening}
                    isListening={isListening}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={() => {
                        const query = searchQuery.trim();
                        if (!query) {
                            setStatusMessage("Type or speak a product name to search.");
                            return;
                        }
                        setSearchQuery(query);
                        setStatusMessage(`Showing matches for "${query}".`);
                    }}
                    onVoiceSearch={handleVoiceSearch}
                    isVoiceSearchListening={isVoiceSearchListening}
                    language={language}
                    setLanguage={setLanguage}
                />

                <TranscriptBox transcript={transcript} statusMessage={statusMessage} error={error} />

                <div style={styles.mainGrid}>
                    <div style={styles.panelColumn}>
                        <SuggestionPanel
                            title="Available products"
                            emptyText="No products match your current search."
                            buttonLabel="Add"
                            suggestions={visibleProducts}
                            onAdd={(name) => handleAddFromCatalog(availableProducts.find((product) => product.name === name) || { name })}
                        />
                        <SuggestionPanel suggestions={suggestions} onAdd={handleSuggestion} />
                    </div>
                    <ShoppingList items={filteredItems} onDelete={handleDelete} onToggleComplete={handleToggleComplete} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "24px",
        background: "linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)",
        color: "#112240"
    },
    card: {
        maxWidth: "1120px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)"
    },
    heroSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "20px"
    },
    eyebrow: {
        margin: "0 0 4px",
        fontSize: "0.76rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#4f46e5"
    },
    title: {
        margin: "0 0 8px",
        fontSize: "1.8rem"
    },
    subtitle: {
        margin: 0,
        color: "#475569",
        maxWidth: "700px"
    },
    mainGrid: {
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "minmax(280px, 340px) 1fr"
    },
    panelColumn: {
        display: "grid",
        gap: "16px"
    }
};

export default Home;