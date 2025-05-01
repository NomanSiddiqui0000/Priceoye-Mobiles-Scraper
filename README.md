# <img src="https://static.priceoye.pk/favicon/ms-icon-310x310.png" width="40" alt="PriceOye Icon"> PriceOye Mobile Scraper



A web scraper built using **Playwright** and **Node.js**, designed to collect detailed mobile phone data from [PriceOye.pk](https://priceoye.pk). The data includes product titles, prices, ratings, reviews, specifications, colors, storage options, and more. All scraped data is stored in a **MongoDB** database.

---

## ✨ Features

- Scrapes mobile phone data across all paginated pages
- Extracts:
  - Product title
  - Price
  - Rating
  - Discount
  - Available colors
  - Number of reviews
  - Storage options
  - Product image
  - Stock status
  - Key specifications
  - Tabular features/specs
  - Product URL
- Stores data with timestamp into a MongoDB collection

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/priceoye-mobile-scraper.git
   cd priceoye-mobile-scraper
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start local MongoDB**  
   Ensure MongoDB is running at `mongodb://127.0.0.1:27017/priceoye`.

4. **Run the scraper**

   ```bash
   node index.js
   ```

---

## 📁 Project Structure

```
├── Scraper.js           # Main scraper script
├── package.json       # Project dependencies and scripts
├── README.md          # Project documentation
```

---

## 🛠 Technologies Used

- [Playwright](https://playwright.dev/) – for headless browser automation
- [MongoDB](https://www.mongodb.com/) – for storing structured data
- [Mongoose](https://mongoosejs.com/) – for MongoDB schema modeling

---

## 📌 Notes

- The script launches in **non-headless mode** for debugging. Change `headless: false` to `true` to run silently.
- MongoDB schema is defined for storing structured and nested mobile data.
- Proper error handling is included for network and DB operations.

---

## 🔒 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Developed by **[Muhammad Noman]** – feel free to reach out for questions or contributions!
