const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('./basePage')

class YandexMarketPage extends BasePage {
    async open() {
        await this.goToUrl("https://market.yandex.ru")
    }

    get CatalogButtonLocator() {
        return By.xpath(`//button/span[text()="Каталог"]/..`)
    }

    get LiInUlLocator() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../../../li[position() = 5]`)
    }

    get LaptopAndComputerLinkLocator() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../..`)
    }
    
    get TabletLinkLocator() {
        return By.xpath(`//div[@data-baobab-name="new-category-snippet"]//h3/following-sibling::div//div[text() = "Планшеты"]/ancestor::a`)
    }

    get SamsungFilter() {
        return By.xpath(`//h4[text() = "Производитель"]/ancestor::legend/following-sibling::div//span[text() = "Samsung"]`)
    }

    get SamsungFilterInLineOfQuickFilters() {
        return By.xpath(`//div[@data-baobab-name="quickFilters"]//span[text() = "Samsung"]`)
    }

    get CheaperFilter() {
        return By.xpath(`//h2[text() = "Сортировка"]/following-sibling::button[text() = "подешевле"]`)
    }

    get RicherFilter() {
        return By.xpath(`//h2[text() = "Сортировка"]/following-sibling::button[text() = "подороже"]`)
    }

    get SearchFieldLocator() {
        return By.xpath(`//input[@id="header-search" and @placeholder="Искать товары"]`)
    }

    get SearchButtonLocator() {
        return By.xpath(`//input[@id="header-search" and @placeholder="Искать товары"]/ancestor::form//button[@data-auto="search-button"]`)
    }

    get ListViewRadioLocator() {
        return By.xpath(`//input[@name="viewType" and @aria-label="в виде списка"]`)
    }

    async getHeaderFromProductCardLocatorByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//h3`)
    }

    async getPriceFromProductCardLocatorByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//div[@data-baobab-name="price"]//span[@data-auto="snippet-price-current"]/span`)
    }

    async waitElementLocated(locator) {
        await this.waitUntil(until.elementLocated(locator))
    }

}

module.exports = new YandexMarketPage()