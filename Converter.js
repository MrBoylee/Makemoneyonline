const fromCurrency = document.getElementById("from-currency");  
    const toCurrency = document.getElementById("to-currency");  
    const amountInput = document.getElementById("amount");  
    const resultDiv = document.getElementById("result");  
    const convertBtn = document.getElementById("convert-btn");  
    const swapBtn = document.getElementById("swap-btn");  
    const offlineMsg = document.getElementById("offline-msg");  
  
    // Currency flags emoji mapping (you can extend this later)  
    const currencyFlags = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  NGN: "🇳🇬",
  GHS: "🇬🇭",
  KES: "🇰🇪",
  ZAR: "🇿🇦",
  EGP: "🇪🇬",
  INR: "🇮🇳",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  BRL: "🇧🇷",
  MXN: "🇲🇽",
  SGD: "🇸🇬",
  KRW: "🇰🇷",
  RUB: "🇷🇺",
  AED: "🇦🇪",
  TRY: "🇹🇷",
  CHF: "🇨🇭",
      // Add more here as needed  
    };  
  
    // Populate currency dropdowns with flags and names  
    async function loadCurrencies() {  
      try {  
        const res = await fetch("https://api.frankfurter.dev/v1/currencies");  
        const data = await res.json();  
  
        for (const code in data) {  
          // Create options with flag + code + full name  
          const optionFrom = document.createElement("option");  
          const optionTo = document.createElement("option");  
          const flag = currencyFlags[code] ? currencyFlags[code] + " " : "";  
  
          optionFrom.value = optionTo.value = code;  
          optionFrom.textContent = flag + code + " - " + data[code];  
          optionTo.textContent = flag + code + " - " + data[code];  
  
          fromCurrency.appendChild(optionFrom);  
          toCurrency.appendChild(optionTo);  
        }  
  
        // Set sensible defaults  
        fromCurrency.value = "USD";  
        toCurrency.value = "EUR";  
      } catch (error) {  
        resultDiv.textContent = "Failed to load currencies.";  
        convertBtn.disabled = true;  
      }  
    }  
  
    // Show loading spinner in result  
    function showLoading() {  
      resultDiv.innerHTML = `<span class="spinner" aria-hidden="true"></span> Converting...`;  
      convertBtn.disabled = true;  
      convertBtn.setAttribute("aria-busy", "true");  
    }  
    // Remove loading spinner  
    function hideLoading() {  
      convertBtn.disabled = false;  
      convertBtn.setAttribute("aria-busy", "false");  
    }  
  
    // Conversion function  
    async function convertCurrency() {  
      // Clear previous offline message  
      offlineMsg.style.display = "none";  
  
      const amount = parseFloat(amountInput.value);  
      const from = fromCurrency.value;  
      const to = toCurrency.value;  
  
      // Validation  
      if (isNaN(amount) || amount <= 0) {  
        resultDiv.textContent = "Enter a valid positive amount.";  
        return;  
      }  
      if (from === to) {  
        resultDiv.textContent = "Please choose different currencies.";  
        return;  
      }  
      if (!navigator.onLine) {  
        offlineMsg.style.display = "block";  
        resultDiv.textContent = "";  
        return;  
      }  
  
      showLoading();  
  
      try {  
        const response = await fetch(  
          `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${from}&to=${to}`  
        );  
        if (!response.ok) throw new Error("Network response not OK");  
        const data = await response.json();  
        const converted = data.rates[to];  
  
        // Format numbers with commas & 2 decimals  
        const formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });  
        const formattedConverted = converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });  
  
        resultDiv.textContent = `${formattedAmount} ${from} = ${formattedConverted} ${to}`;  
      } catch (error) {  
        resultDiv.textContent = "Error fetching conversion rates.";  
      } finally {  
        hideLoading();  
      }  
    }  
  
    // Swap currencies  
    function swapCurrencies() {  
      const temp = fromCurrency.value;  
      fromCurrency.value = toCurrency.value;  
      toCurrency.value = temp;  
      resultDiv.textContent = "";  
    }  
  
    // Offline/online detection  
    window.addEventListener('offline', () => {  
      offlineMsg.style.display = "block";  
    });  
    window.addEventListener('online', () => {  
      offlineMsg.style.display = "none";  
    });  
  
    // Event listeners  
    convertBtn.addEventListener("click", convertCurrency);  
    swapBtn.addEventListener("click", swapCurrencies);  
  
    // Initialize currencies on page load  
    loadCurrencies();  
  
    /*   
    ===== PINNED FEATURES TO ADD LATER =====  
    - Save Recent Conversions locally (localStorage or IndexedDB)  
    - Dark Mode toggle  
    - Progressive Web App (PWA) support  
    - Multi-language support  
    - More currency flags  
    - Button animations (e.g., ripple effect)  
    - History panel UI  
    */