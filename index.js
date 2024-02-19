import { promises } from "fs";
import puppeteer from "puppeteer";

// INSIRA SUAS INFORMACOES A SEREM USADAS EDITANDO AS CONSTANTES AQUI ABAIXO
const NOME_COMPLETO = "Fulano Siclano da Silva";
const EMAIL = "fulano@gmail.com";
const NACIONALIDADE = "Brasileira";
const IDADE = "33";
const GENERO = "Masculino";
const ESTADO_CIVIL = "Solteiro";
const TELEFONE = "(71)1234-5678";
const CELULAR = "(71)12345-6789";
const ENDERECO = "Rua das automacoes, 25";
const CIDADE = "Salcity";
const ESTADO = "Bahia";
const CEP = "40000-00";
const OBJETIVO =
  "Fornecer uma ferramenta automatizada gratuita para criacao de curriculos.";

//==============SELETORES E CONSTANTES AUXILIARES==============
const LINK = "https://www.todacarreira.com/gerador-de-curriculo/";
const SELETOR_NOME_COMPLETO = '[name="name"]';
const SELETOR_EMAIL = '[name="email"]';
//TODO: FOTO_PERFIL
const SELETOR_NACIONALIDADE = '[name="nationality"]';
const SELETOR_IDADE = '[name="age"]';
const SELETOR_GENERO = '[name="gender"]';
const SELETOR_ESTADO_CIVIL = '[name="marital"]';
const SELETOR_TELEFONE = '[name="telephone"]';
const SELETOR_CELULAR = '[name="mobile"]';
const SELETOR_ENDERECO = '[name="address"]';
const SELETOR_CIDADE = '[name="city"]';
const SELETOR_ESTADO = '[name="state"]';
const SELETOR_CEP = '[name="cep"]';
const SELETOR_OBJETIVO = '[name="career-goal"]';
const SELETOR_BOTAO_PAG_SEGUINTE = "#btnNext";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TYPING_DELAY = 50;
const MAX_CHARS = 5000;
//======================INICIA AQUI==========================

async function curriculumBot() {
  try {
    const [contexto, navegador, pagina] = await configsIniciais();

    await pagina.goto(LINK);

    await preencherPaginaDadosPessoais(pagina);

    await avancarPagina(pagina);

    // await aguarde(10000);

    // await navegador.close();
  } catch (error) {
    console.log(`${await adquirirTempoAgora()} - ${error}\n`);
    process.exit();
  }
}

async function configsIniciais() {
  const meusArgs = [
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

  const opcoes = {
    args: meusArgs,
    headless: false,
    defaultViewport: null,
  };

  const navegador = await puppeteer.launch(opcoes);

  const contexto = await navegador.createIncognitoBrowserContext();
  const pagina = await contexto.newPage();

  await pagina.setUserAgent(USER_AGENT);

  await contexto.overridePermissions(LINK, ["geolocation"]);

  await pagina.setViewport({ width: 1280, height: 800 });

  pagina.setDefaultTimeout(61000);

  return [contexto, navegador, pagina];
}

async function preencherPaginaDadosPessoais(pagina) {
  await pagina.waitForSelector(SELETOR_NOME_COMPLETO);
  await apagarCampo(pagina, SELETOR_NACIONALIDADE);
  await digitarCampo(pagina, NOME_COMPLETO, SELETOR_NOME_COMPLETO);
  await digitarCampo(pagina, EMAIL, SELETOR_EMAIL);
  await digitarCampo(pagina, NACIONALIDADE, SELETOR_NACIONALIDADE);
  await digitarCampo(pagina, IDADE, SELETOR_IDADE);
  // await digitarInfo(pagina, GENERO, SELETOR_GENERO);
  // await digitarInfo(pagina, ESTADO_CIVIL, SELETOR_ESTADO_CIVIL);
  await digitarCampo(pagina, TELEFONE, SELETOR_TELEFONE);
  await digitarCampo(pagina, CELULAR, SELETOR_CELULAR);
  await digitarCampo(pagina, ENDERECO, SELETOR_ENDERECO);
  await digitarCampo(pagina, CIDADE, SELETOR_CIDADE);
  await digitarCampo(pagina, ESTADO, SELETOR_ESTADO);
  await digitarCampo(pagina, CEP, SELETOR_CEP);
  await digitarCampo(pagina, OBJETIVO, SELETOR_OBJETIVO);
}

//====================FUNCOES AUXILIARES=====================

async function adquirirDataFormatada(date) {
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

async function adquirirTempoAgora() {
  const now = new Date();
  return await adquirirDataFormatada(now);
}

async function aguardar(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function apagarCampo(pagina, seletor) {
  await pagina.click(seletor);
  for (let index = 0; index < MAX_CHARS; index++) {
    await pagina.keyboard.press("Backspace");
  }
}

async function avancarPagina(pagina) {
  await pagina.click(SELETOR_BOTAO_PAG_SEGUINTE);
}

async function digitarCampo(pagina, info, seletor) {
  await pagina.type(seletor, info, TYPING_DELAY);
}

async function escreverLog(receivedString) {
  let string = `${await adquirirTempoAgora()} - ${receivedString}\n`;
  await promises.writeFile(
    "./registries.log",
    string,
    { flag: "a+" },
    (err) => {}
  );
}

//====================FUNCAO PRINCIPAL======================
await curriculumBot();
