import { chromium } from "playwright";
import mongoose from "mongoose";



// MongoDB connection (local)
await mongoose.connect("mongodb://127.0.0.1:27017/priceoye", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema Definition
const mobileSchema = new mongoose.Schema({
  title: String,
  Price: String,
  Rating: String,
  Discount: String,
  Colors: [String], 
  Reviews: String,
  Storages: [String], 
  image: String,
  status: String,
  Specifications: [String], 
  features: [mongoose.Schema.Types.Mixed], 
  url: String,
  scrapedAt: { type: Date, default: Date.now },
});


// Create Model from Schema
const Mobile = mongoose.model("Mobile", mobileSchema);

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://priceoye.pk/mobiles", {
      timeout: 50000,
      waitUntil: "domcontentloaded",
    });

    async function categorydata(link) {
      const productPage = await context.newPage(); 
      await productPage.goto(link, {
        timeout: 30000,
        waitUntil: "domcontentloaded",
      });

      const item = await productPage.evaluate(() => {
        const title =
          document.querySelector("h3.h2")?.innerText.trim() || "No Title";
        const Price =
          document.querySelector(
            ".summary-price.text-black.price-size-lg.bold span"
          )?.innerText.trim() || "No Price found";
        const Rating =
          document.querySelector(".semi-bold.rating-points")?.innerText.trim() ||
          "No Rating";
          const Discount =
          document.querySelector(".save-price")?.innerText.trim() ||
          "No Discount found";    
          const Colors = Array.from(document.querySelectorAll('.color-name span')).map(span => span.innerText.trim());      
        const Reviews =
          document.querySelector(".semi-bold.rating-count")?.innerText.trim() ||
          "No Reviews found";
          const Storages = Array.from(document.querySelectorAll('.size-item a span')).map(el => el.innerText.trim());

        const image =
          document.querySelector(".main-product-img")?.src || "No Image found";
        const status =
        document.querySelector(".summary-price.stock-status")?.innerText.trim() || "No Status Found";
        const Specifications = Array.from(document.querySelectorAll('ul li strong')).map(el => el.innerText.trim());
      
        const features = Array.from(document.querySelectorAll('.p-spec-table.card tbody tr')).map(row => {
          const key = row.querySelector('th')?.innerText.trim();  
          const value = row.querySelector('td')?.innerText.trim();  
          
          return { [key]: value };  
        });


        return { title, Price, Rating, Discount,Colors, Reviews, Storages, image, status ,Specifications, features};
      });

      console.log("Item Details:", item);

      // Save the scraped data to MongoDB
      try {
        await Mobile.create({ ...item, url: link });
      } catch (err) {
        console.error("MongoDB Save Error:", err);
      }

      await productPage.close();
    }

    // Pagination loop
    while (true) {
      await page.waitForSelector(".productBox a", { timeout: 15000 });

      const links = await page.$$eval(".productBox a", (elements) =>
        elements.map((el) => el.href)
      );

      for (let link of links) {
        await categorydata(link);
      }

      // Handle "Next" button
      const nextBtn = await page.$("#next-button");

      if (!nextBtn) {
        console.log("No next button found. Ending.");
        break;
      }

      const isDisabled = await nextBtn.getAttribute("aria-disabled");
      if (isDisabled === "true") {
        console.log("Next button is disabled. Reached last page.");
        break;
      }

      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        nextBtn.click(),
      ]);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
