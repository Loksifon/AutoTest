const { before, after, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const page = require('../pages/yandexPage')

function getDate() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
  
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
  }
  


describe('Тест Яндекс.Маркет', async function() {
    
    this.timeout(10000);

    before(async function() {
        await page.open()
    })

    it('Открывает каталог', async function() {
        await page.waitElementLocated(page.CatalogButtonLocator)
        page.sleep(1000)

        await page.click(page.CatalogButtonLocator)
    })
    
    it('Переходит по ссылке Компьютеры', async function() {
        await page.waitElementLocated(page.LiInUlLocator)
        page.sleep(1000)
        
        await page.click(page.LaptopAndComputerLinkLocator)
    })

    it('Переходит по ссылке Планшеты', async function() {
        await page.waitElementLocated(page.TabletLinkLocator)
        await page.sleep(1000)
        
        await page.click(page.TabletLinkLocator)
    })
    
    it('фильтр дешевле', async function() {
        await page.waitElementLocated(page.CheaperFilter)
        await page.sleep(1000)

        await page.click(page.CheaperFilter)
        await page.sleep(3000)
    })

    it('фильтр Samsung', async function() {
        await page.waitElementLocated(page.SamsungFilter)
        await page.sleep(1000)
        
        await page.click(page.SamsungFilter)
        await page.waitElementLocated(page.SamsungFilterInLineOfQuickFilters)
        await page.sleep(1000)
    })

    let rememberHeading
    let rememberPrice

    it('Выводит первые пять товаров', async function() {
        await page.waitElementLocated(await page.getHeaderFromProductCardLocatorByID(1))
        await page.sleep(1000)
        
        console.log(`Первые пять:`)
        for (let i=0; i<5; i++) {
            let cardHeaderLocator = await page.getHeaderFromProductCardLocatorByID(i+1)
            let cardPriceLocator = await page.getPriceFromProductCardLocatorByID(i+1)

            let text = await page.getTextOfElement(cardHeaderLocator)
            let price = await page.getTextOfElement(cardPriceLocator)
            if (i == 1) {
                rememberHeading = text
                rememberPrice = price
            }
            console.log(`\t${i+1}) ${text} - ${price} рублей`)
        }

        console.log(`товар: \n\t ${rememberHeading} - ${rememberPrice} рублей`);
    })

    it('Вводит в поисковую строку', async function() {
        page.sleep(1000)
        await page.enterText(page.SearchFieldLocator, rememberHeading)
        page.sleep(2000)
        await page.click(page.SearchButtonLocator)
    })

    it('Сравнивает первый выведенный товар с записанными данными', async function() {
        await page.waitElementLocated(await page.ListViewRadioLocator)
        await page.sleep(1000)
        
        await page.click(page.ListViewRadioLocator)

        await page.waitElementLocated(await page.getHeaderFromProductCardLocatorByID(1))
        await page.sleep(1000)

        let cardHeaderLocator = await page.getHeaderFromProductCardLocatorByID(1)
        let cardPriceLocator = await page.getPriceFromProductCardLocatorByID(1)

        let text = await page.getTextOfElement(cardHeaderLocator)
        let price = await page.getTextOfElement(cardPriceLocator)

        expect(text).to.equal(rememberHeading)
        expect(price).to.equal(rememberPrice)
    })

    afterEach(async function() {
        if (this.currentTest.state == 'failed') {
            let dateTime = getDate()
            let imageFileName = `${this.currentTest.title}_${dateTime}.jpg`
            await page.saveScreenshot(imageFileName)
        }
    })

    after(async function() {
        await page.closeBrowser()
    })
})