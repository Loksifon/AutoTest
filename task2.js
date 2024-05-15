const { Builder, Browser, By } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

class MospolytechTimeTablePage {
    constructor(driver) {
        this.driver = driver;
        this.timetableLink = "//a[@href='/obuchauschimsya/raspisaniya/']";
        this.externalTimetableLink = "//a[@href='https://rasp.dmami.ru/']";
    }
    async load() {
        await this.driver.get('https://mospolytech.ru/');
    }
    async clickTimetableLink() {
        await this.clickLink(this.timetableLink);
    }
    async clickExternalTimetableLink() {
        await this.clickLink(this.externalTimetableLink);
    }
    async switchToNewTab(){
        const initialWindowHandle = await this.driver.getWindowHandle();
        const newWindowHandle = await this.driver.wait(async () => {
            const handlesAfterAction = await this.driver.getAllWindowHandles();
            return handlesAfterAction.find(handle => handle !== initialWindowHandle);
        }, 3000);
        if (newWindowHandle) {
            await this.driver.switchTo().window(newWindowHandle);
        }
    }
    async getMospolytechTimeTablePageTitle(){
        return await this.driver.findElement(By.xpath('//h1')).getText();
    }

    async clickLink(xpath) {
        await this.driver.findElement(By.xpath(xpath)).click();
    }
}

class TimetablePage {
    constructor(driver) {
        this.driver = driver;
        this.groupNumber = '221-323';
        this.searchField = By.className('groups');
        this.groupElement = By.id(this.groupNumber);
    }
    async searchGroup() {
        const searchField = await this.driver.findElement(this.searchField);
        await searchField.sendKeys(this.groupNumber);
        const resultElements = await this.driver.findElements(By.className('group'));
        const groupTexts = await Promise.all(resultElements.map(async (element) => {
            return await element.getText();
        }));
        if (groupTexts.length === 1 && groupTexts[0] === this.groupNumber) {
            await this.driver.findElement(this.groupElement).click();
        }
        await this.driver.sleep(1000);
    }
    async openGroup(){
        await this.driver.findElement(this.groupElement).click();
        await this.driver.sleep(1000);
    }

    async checkColor() {
        await this.driver.findElement(By.className('goToToday')).click();
        const parentElements = [await this.driver.findElement(By.className("schedule-day_today"))];
        const data = await Promise.all(parentElements.map(async (element) => {
            const title = await element.findElement(By.className("schedule-day__title")).getText();
            return title;
        }));
        return data;
    }
}

describe('Timetable Page Test', () => {
    let driver;
    let page;
    let timetablePage;

    before(async () => {
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        page = new MospolytechTimeTablePage(driver);
        timetablePage = new TimetablePage(driver);
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            const screenshot = await driver.takeScreenshot();
            const testCaseName = this.currentTest.title.replace(/\s+/g, '-').toLowerCase();
            const dateTime = new Date().toISOString().replace(/[-:.]/g, '');
            const fileName = `${testCaseName}-${dateTime}.png`;
            await writeFileAsync(fileName, screenshot, 'base64');
        }
    });

    after(async () => {
        await driver.quit();
    });

    it('should search for a group timetable', async function() {
        this.timeout(5000); 
        await page.load();
        await page.clickTimetableLink();
        const header = await page.getMospolytechTimeTablePageTitle();
        assert.strictEqual(header, 'Расписания');
        await page.clickExternalTimetableLink();
        await page.switchToNewTab();
        await timetablePage.searchGroup();
        await timetablePage.openGroup();
        const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        const now = new Date();
        const weekdayIndex = now.getDay() - 1;
        const result = await timetablePage.checkColor(); 
        assert.strictEqual(result[0], weekdays[weekdayIndex]);
    });
});
