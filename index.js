import { promises } from "fs";
import puppeteer from "puppeteer";

const LINK = "https://www.todacarreira.com/gerador-de-curriculo/";
// INSIRA SUAS CREDENCIAIS
const USER = "";
const PASS = "";
const USER_FIELD = "#input-email";
const PASS_FIELD = "#input-password";
const LOGIN_BUTTON = ".btn-primary";
const REGISTER_BUTTON_TEXT = "punch";
const CONFIRM_BUTTON_TEXT = "confirm";
const PUNCH_REGISTERED_CONFIRMATION = ".marked-btn";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const TYPING_DELAY = 50;
const MAXIMUM_TRIES = 3;

//========================INICIA AQUI========================

async function curriculumBot() {
  var startDate = new Date().getDate();
  var triesCounter = 0;

  try {
    const [browser, context, page] = await initialConfigs();

    const viewport = page.viewport();
    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;

    await page.goto(LINK);

    await wait(10000);

    await browser.close();

    // await page.waitForSelector(USER_FIELD);

    // await page.type(USER_FIELD, USER, { delay: TYPING_DELAY });
    // await page.type(PASS_FIELD, PASS, { delay: TYPING_DELAY });

    // await page.click(LOGIN_BUTTON);

    // await page.waitForNavigation({
    //   waitUntil: "networkidle0",
    // });

    // var instantFullTimeStr, instantDay, instantDateObj, instantDate;
    // var entranceTimerToUse = await pickTimer(ENTRANCE_TIMERS);
    // var exitTimerToUse = await pickTimer(EXIT_TIMERS);
    // await writeLog(
    //   `HORARIOS A BATER NO DIA ${startDate}: ${entranceTimerToUse} / ${exitTimerToUse}`
    // );

    // //LOOP ETERNO COM A LOGICA
    // while (true) {
    //   await wait(2000);
    //   instantDateObj = new Date();
    //   instantDate = instantDateObj.getDate();

    //   if (instantDate == startDate) {
    //     instantDay = instantDateObj.getDay();

    //     if (await isValidDay(instantDay)) {
    //       instantFullTimeStr = await formatTimeString(instantDateObj);

    //       if (
    //         instantFullTimeStr == entranceTimerToUse ||
    //         instantFullTimeStr == exitTimerToUse
    //       ) {
    //         await punchButton(page, REGISTER_BUTTON_TEXT);
    //         await punchButton(page, CONFIRM_BUTTON_TEXT);
    //         if (await validatePunch(page)) {
    //           await writeLog(
    //             `PONTO BATIDO COM SUCESSO! - ${instantFullTimeStr}`
    //           );
    //           triesCounter = 0;
    //           await wait(60000);
    //           await page.mouse.click(centerX, centerY);
    //         } else {
    //           if (triesCounter >= MAXIMUM_TRIES) {
    //             await writeLog(`MAXIMO DE TENTATIVAS ATINGIDO!`);
    //             await wait(60000);
    //             process.exit();
    //           } else {
    //             await writeLog(
    //               `ERRO AO BATER PONTO! TENTATIVA ${
    //                 triesCounter + 1
    //               } DE ${MAXIMUM_TRIES} - ${instantFullTimeStr}`
    //             );
    //             await page.mouse.click(centerX, centerY);
    //             triesCounter++;
    //           }
    //         }
    //       }
    //     }
    //   } else {
    //     //LOGICA DE VIRADA DE DIA
    //     startDate = instantDate;
    //     entranceTimerToUse = await pickTimer(ENTRANCE_TIMERS);
    //     exitTimerToUse = await pickTimer(EXIT_TIMERS);
    //     await writeLog(
    //       `HORARIOS A BATER NO DIA ${startDate}: ${entranceTimerToUse} / ${exitTimerToUse}`
    //     );
    //   }
    // }
  } catch (error) {
    console.log(`${await getTimerNow()} - ${error}\n`);
    process.exit();
  }
}

async function initialConfigs() {
  const my_args = [
    "--disable-extensions",
    "--disable-features=IsolateOrigins,site-per-process",
    "--disable-gpu",
    "--disable-infobars",
    "--disable-setuid-sandbox",
    "--disable-web-security",
    "--enable-webgl",
    "--enable-accelerated-2d-canvas",
    "--force-device-scale-factor",
    "--ignore-certificate-errors",
    "--no-sandbox",
    "--disable-features=site-per-process",
    "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
    "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
  ];

  const options = {
    args: my_args,
    headless: false,
    defaultViewport: null,
  };

  const browser = await puppeteer.launch(options);

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setUserAgent(USER_AGENT);

  await context.overridePermissions(LINK, ["geolocation"]);

  await page.setViewport({ width: 1280, height: 800 });

  page.setDefaultTimeout(61000);

  return [browser, context, page];
}

async function formatTimeString(instantDateObj) {
  try {
    let instantHoursStr = instantDateObj.getHours().toString();

    if (instantDateObj.getHours() < 10) {
      instantHoursStr = `0${instantHoursStr}`;
    }

    let instantMinutesStr = instantDateObj.getMinutes().toString();
    if (instantDateObj.getMinutes() < 10) {
      instantMinutesStr = `0${instantMinutesStr}`;
    }

    return `${instantHoursStr}:${instantMinutesStr}`;
  } catch (error) {
    console.log(`${await getTimerNow()} - ${error}\n`);
  }
}

async function getFormattedDate(date) {
  const options = {
    timeZone: "America/Sao_Paulo", // Configura o fuso horário para Brasília (BRT)
    hour12: false, // Usa formato de 24 horas
    // weekday: 'short', // Exibe apenas o dia da semana abreviado
    year: "numeric", // Exibe apenas o ano (com 4 dígitos)
    month: "2-digit", // Exibe o mês como dois dígitos
    day: "2-digit", // Exibe o dia do mês como dois dígitos
    hour: "2-digit", // Exibe a hora como dois dígitos
    minute: "2-digit", // Exibe os minutos como dois dígitos
    second: "2-digit", // Exibe os segundos como dois dígitos
  };

  return date.toLocaleString("pt-BR", options);
}

async function getTimerNow() {
  const now = new Date();
  return await getFormattedDate(now);
}

async function isValidDay(day) {
  return INT_VALID_DAYS.includes(day);
}

async function pickTimer(timersList) {
  const randomIndex = Math.floor(Math.random() * timersList.length);
  return timersList[randomIndex];
}

async function punchButton(page, buttonTextToClick) {
  try {
    const buttons = await page.$$("button");

    for (const button of buttons) {
      const buttonText = await page.evaluate(
        (element) => element.textContent,
        button
      );

      if (
        buttonText
          .trim()
          .toLowerCase()
          .includes(buttonTextToClick.toLowerCase())
      ) {
        await button.evaluate((h) => {
          h.click();
        });
        await wait(2000);
        break;
      }
    }
  } catch (error) {
    console.log(`${await getTimerNow()} - ${error}\n`);
  }
}

async function validatePunch(page) {
  await wait(10000);

  return page.evaluate((selector) => {
    const markedBtnElements = document.querySelectorAll(selector);
    return markedBtnElements.length > 0;
  }, PUNCH_REGISTERED_CONFIRMATION);
}

async function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function writeLog(receivedString) {
  let string = `${await getTimerNow()} - ${receivedString}\n`;
  await promises.writeFile(
    "./registries.log",
    string,
    { flag: "a+" },
    (err) => {}
  );
}

await curriculumBot();
