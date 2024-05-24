import assert from 'assert';
import { Builder, By } from 'selenium-webdriver';
import fs from 'fs/promises';

let total = 5;
let remaining = 5;
let driver = new Builder().forBrowser('chrome').build(); 

async function findElementByXPath(xpath) {
    return await driver.findElement(By.xpath(xpath));
}

async function clickElementByXPath(xpath) {
    let element = await findElementByXPath(xpath);
    await element.click();
}

async function findElementById(id) {
    return await driver.findElement(By.id(id));
}

async function Task1Test() {
    try {
        await driver.get("https://lambdatest.github.io/sample-todo-app/");
        await driver.manage().window().maximize();

        let pageTitleElement = await findElementByXPath(`//h2`);
        let pageTitle = await pageTitleElement.getText();
        assert.equal(pageTitle, "LambdaTest Sample App", "Заголовок страницы не соответствует ожидаемому");

        let text = await driver
            .findElement(By.xpath(`//span[text()='${remaining} of ${total} remaining']`))
            .getText();
        assert.equal(text, `${remaining} of ${total} remaining`);

        await driver.sleep(1000);

        for (let i = 1; i <= total; i++) {
            let itemClass = await findElementByXPath(`//li[${i}]//span[@class='done-false']`);
            assert.ok(itemClass, "Первый элемент имеет класс done-false");

            await clickElementByXPath(`//li[${i}]/input`);
            remaining--;

            let itemChecked = await findElementByXPath(`//li[${i}]//span[@class='done-true']`);
            assert.ok(itemChecked, "Элемент списка имеет класс 'done-true' после клика");

            await driver.sleep(1000);
        }

        await (await findElementById("sampletodotext")).sendKeys("Sixth Item");
        await (await findElementById("addbutton")).click();
        total++;
        remaining++;
        await driver.sleep(1000);

        await clickElementByXPath("//ul/li[6]/input");
        remaining--;

        let text1 = await findElementByXPath(`//span[text()='${remaining} of ${total} remaining']`).getText();
        assert.equal(text1, `${remaining} of ${total} remaining`);

        remaining--;

        await driver.sleep(2000);

        let text2 = await findElementByXPath(`//span[text()='${remaining} of ${total} remaining']`).getText();
        assert.equal(text2, `${remaining} of ${total} remaining`);

        await driver.sleep(2000);

        console.log('Всё работает');

    } catch (err) {
        let image = await driver.takeScreenshot();
        await fs.writeFile('screenshot_error.png', image, 'base64');
        console.error('Все сломалось по причине: %s', err);
    } finally {
        await driver.quit();
    }
}

Task1Test();
