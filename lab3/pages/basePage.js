const {Builder, Browser, until} = require('selenium-webdriver')

class BasePage {
    async goToUrl(url) {
        global.driver = new Builder().forBrowser(Browser.CHROME).build();
        driver.manage().setTimeouts({implicit: 5000});
        driver.manage().window().maximize();
        await driver.get(url);
    }

    async findElement(locator) {
        return await driver.findElement(locator)
    }

    async getClassOfElement(locator) {
        return await driver.findElement(locator).getAttribute('class')
    }

    async getTextOfElement(locator) {
        return await driver.findElement(locator).getText()
    }

    async enterText(locator, textToEnter) {
        await driver.findElement(locator).sendKeys(textToEnter);
    }

    async scrollFromElementByGivenAmount(locator, yDelta) {
        const iframe = await driver.findElement(locator)
        await driver.actions()
        .scroll(0, 0, 0, yDelta, iframe)
        .perform()
    }

    async focus(locator) {
        const hoverable = await driver.findElement(locator);
        const actions = driver.actions({async: true});
        await actions.move({origin: hoverable}).perform();
    }

    async click(locator) {
        await driver.findElement(locator).click();
    }

    async closeBrowser() {
        await driver.sleep(1000);
        await driver.quit()
    }

    async getPageTitle() {
        return await driver.getTitle()
    }

    async saveScreenshot(fileName) {
        driver.takeScreenshot().then(function(image) {
            require('fs').writeFileSync("./images/task3/" + fileName, image, 'base64')
        })
    }

    async waitUntil(condituion) {
        await driver.wait(condituion)
    }

    async reloadPage() {
        await driver.navigate().refresh();
    }

    async SwitchToNextTab() {
        let originalTab = await driver.getWindowHandle();
        const windows = await driver.getAllWindowHandles();
        
        windows.forEach(async handle => {
            if (handle !== originalTab) {
                await driver.switchTo().window(handle);
            }
        });
    }

    async sleep(milliseconds) {
        await driver.sleep(milliseconds * 3)
    }
}

module.exports = BasePage