const API_URL = import.meta.env.VITE_API_URL || "";

console.log("FasFas API_URL:", API_URL || "(using Vite proxy)");

export default API_URL;