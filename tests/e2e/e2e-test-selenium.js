import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver';

(async function testReactApp() {
    // Opsæt Chrome browser i headless mode
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
  
    // Initializér WebDriver
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  
    try {
      // Navigér til React app
      await driver.get('http://localhost:5173');
  
      // Finder "Get Persons" knappen og klikker på den
      let getPersonsButton = await driver.findElement(By.xpath("//button[text()='Get Persons']"));
      await getPersonsButton.click();
  
      // Vent på person list dukker op
      await driver.wait(until.elementLocated(By.css('li')), 5000);
  
      // Find alle list items
      let personsList = await driver.findElements(By.css('li'));
  
      if (personsList.length > 0) {
        console.log(`Test Passed: ${personsList.length} persons fetched and displayed.`);
        for (let person of personsList) {
          let personText = await person.getText();
          console.log(personText);
        }
      } else {
        console.log("Test Failed: No persons displayed.");
      }
  
    } finally {
      // Quit browseren
      await driver.quit();
    }
  })();