const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const mongo = require('mongodb').MongoClient

async function scrape(scrapePaths, pageUrl, browser, screenshot) {
    console.log('Scraping', pageUrl)
    const page = await browser.newPage()
    const delay = (Math.floor(Math.random() * 7)) + 2;
    setTimeout(function () {
    }, delay * 1000)
    try {
        await page.goto(pageUrl, {timeout: 0})
    } catch (e) {
        throw e
    }
    if (screenshot) {
        await page.screenshot({path: 'example.png'});
    }
    const result = {title: await page.title()}
    for (let scrapePath of scrapePaths) {
        let elements = await page.$$(scrapePath)
        elements = await Promise.all(elements.map(async function (element) {
            let result = {
                href: await page.evaluate(el => el.href, element),
                innerText: await page.evaluate(el => el.innerText, element),
                src: await page.evaluate(el => el.src ? el.src : undefined, element)
            }
            return result
        }))
        result[scrapePath] = elements;
    }
    console.log('Done Scraping', pageUrl)
    await page.close()
    return result
}

// scrape terminalx
async function scrape_stuff(browser) {

    // Get all categories from main page
    let categories = await scrape([categoriesPath],
        'https://www.terminalx.com/women', browser)
    categories = categories[categoriesPath]
    result = {categories: [], brands: new Map(), products: []}
    for (const category_index in categories) {
        const category = categories[category_index]
        // Create category mongo object
        let category_entry = {
            name: category.innerText,
            _id : category.innerText, children: []
        }
        // Get all sub categories from category page
        let sub_categories = await scrape([subCategoryPath], category.href, browser)
        sub_categories = sub_categories[subCategoryPath]
        if (!sub_categories || sub_categories.length == 0) {
            sub_categories = [category]
        }
        for (const sub_category_index in sub_categories) {
            const sub_category = sub_categories[sub_category_index]
            // Add sub_category to category object
            category_entry.children.push({ name: sub_category.innerText,
                _id: sub_category.innerText})

            // Get product details from sub_category page
            const products = await scrape([productsPath, pricePath, imagePath, brandPath], sub_category.href, browser)

            // If all data exists create a batch of products
            if (products[productsPath] && products[pricePath] && products[imagePath] && products[brandPath]) {
                    const product_bulk = []
                    let products_titles = products[productsPath].map(title => title.innerText)
                    let product_prices = products[pricePath].filter(price => price.innerText.includes('₪')).map(price => price.innerText)
                    let product_images = products[imagePath].map(image => image.src)
                    let brands = products[brandPath].map(brand => brand.innerText)
                    for (let index in products_titles) {
                        if (product_prices[index] && product_images[index]) {
                            product_bulk.push({
                                title: products_titles[index],
                                price: Number(product_prices[index].replace(/[^0-9\.]/g, '')),
                                image_url: product_images[index],
                                brand: brands[index],
                                category: category.innerText,
                                sub_category: sub_category.innerText,
                                vendor: {
                                    $ref: "vendors",
                                    "$id": "terminalx"
                                }
                            })

                            // Save brand to brand objects result
                            if (brands[index]) {
                                result.brands.set(brands[index], {_id: brands[index]})
                            }
                        }
                    }

                    // push products to result
                    result.products.push(...product_bulk)
                    product_count += product_bulk.length
            }

        }
        result.categories.push(category_entry)

        // If reached limit return the results
        if (product_count > product_limit){
            return result
        }
    }
}


// CSS Selector paths to all needed elements
const categoriesPath = '#app-root > div > header > div > div > div > div:nth-child(4) > div > ul > li:nth-child(n+3):nth-child(-n+9) > a'
const subCategoryPath = '#app-root > div > main > div > div > div > div > div > div:nth-child(2) > ol > li > a'
const productsPath = '#app-root > div > main > div > div > div > div > div > ol > li > div > div > div > a[class*="title"]'
const pricePath = '#app-root > div > main > div > div > div > div > div > ol > li > div > div > div > div > div[class*="final-price"]'
const brandPath = '#app-root > div > main > div > div > div > div > div > ol > li > div > div > div[class*="right"] > span'
const imagePath = '#app-root > div > main > div > div > div > div > div > ol > li > div > a > div > div > img'

// configuration for scraping
let product_count = 0
const product_limit = 400

// default vendor
const seller_info = {
    _id: 'terminalx',
    display_name: 'TERMINAL X',
    google_location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13218.66413793563!2d34.82051903627558!3d32.09074215151656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b679d07b37d%3A0x45c0d5a76c90ff5!2sTerminalX!5e0!3m2!1siw!2sil!4v1657283485524!5m2!1siw!2sil',
    contact_email: 'terminalx@terminalx.com',
    contact_phone: '055-55555555',
    image_url: 'https://media.terminalx.com/pub/media//catalog/category/terminalx-brand.jpg'
}

mongo.connect("mongodb://localhost:27017/shop", (err, connection) => {

    const db = connection.db("shop");

    puppeteer.use(StealthPlugin())
    const browser = puppeteer.launch({product: "chrome"})
    async function write_to_db(entries, collection_name) {
        db.collection(collection_name).insertMany(entries)
    }

    puppeteer.launch({product: "chrome"})
        .then((browser) => {
            return browser
        }).then(browser => {
            result = scrape_stuff(browser).then(async function(results) {
                await write_to_db([seller_info], "vendors")
                await write_to_db(results.categories, 'categories')
                await write_to_db(results.products, 'products')
                await write_to_db(Array.from(results.brands.values()), 'brands')
                browser.close()
            })
    })
})
