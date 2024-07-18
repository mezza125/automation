import { chromium, Browser, Page } from "playwright";
import { getEncryptedPassword } from "./password-utils";
import { getExcelContent } from "./file-utils";
import { addAttach } from "jest-html-reporters/helper";
import * as fs from "fs";

// necesita cargarse sincronamente para que el test pueda leerlo
let data: { id: string; name: string }[] = getExcelContent(
  "src/Datos-pruebas.xlsx"
);

jest.setTimeout(8000);

describe("Wikipedia profile test", () => {
  let browser: Browser;

  beforeAll(async () => {
    console.log("data to test", data);

    browser = await chromium.launch({
      headless: false,
      timeout: 15 * 1000,
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    console.log("encrypted password", getEncryptedPassword());
  });

  data.forEach((pokemon) => {
    test(`Should navigate to Wikipedia's ${pokemon.name} page`, async () => {
      const page: Page = await browser.newPage({
        baseURL: "https://en.wikipedia.org",
        recordVideo: {
          dir: `videos/${pokemon.name}/`,
          size: {
            width: 800,
            height: 600,
          },
        },
      });
      await page.goto(`wiki/${pokemon.name}`);
      await page.waitForLoadState();
      const screenShot = await page.screenshot();
      await addAttach({
        attach: screenShot,
        description: "Screenshot of the wikipedia page for " + pokemon.name,
      });

      const title = await page.locator("#firstHeading").first().textContent();

      expect(title?.toLowerCase()).toBe(pokemon.name.toLowerCase());

      // no usar el Id dado que varia en cada pagina
      const conceptAndDesignH2 = await page
        .locator("h2 > span")
        .first()
        .evaluateHandle((e) => e.parentElement);

      console.log(
        "conceptAndDesignH2 innerHTML",
        await conceptAndDesignH2.asElement()?.innerHTML()
      );

      // get the next p element sibling to conceptAndDesign h2 element
      const firstParaphText = await conceptAndDesignH2
        .evaluateHandle((e) => e?.nextElementSibling)
        .then((e) => e?.asElement()?.textContent());

      console.log({ primerParrafo: firstParaphText });

      expect(firstParaphText?.toLowerCase()).toContain(
        pokemon.name.toLowerCase()
      );

      const videoPath = await page.video()?.path();
      await page.close();

      await addAttach({
        attach: fs.readFileSync(videoPath as string),
        description: "Video " + pokemon.name,
        bufferFormat: "webm",
      });
    });
  });
});
