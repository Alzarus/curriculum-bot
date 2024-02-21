import path from "path";
import puppeteer from "puppeteer";

// INSIRA SUAS INFORMACOES A SEREM USADAS EDITANDO AS CONSTANTES AQUI ABAIXO
const ESTILO_CURRICULO = 1;
const NOME_COMPLETO = "Fulano Ciclano da Silva";
const EMAIL = "fulano@gmail.com";
const NACIONALIDADE = "Brasileira";
const IDADE = "33";
const GENERO = "Masculino";
const ESTADO_CIVIL = "Solteiro";
const TELEFONE = "(71)1234-5678";
const CELULAR = "(71)12345-6789";
const ENDERECO = "Rua das automações, 25";
const CIDADE = "Salcity";
const ESTADO = "Bahia";
const CEP = "41234-567";
const OBJETIVO =
  "Fornecer uma ferramenta automatizada gratuita para a criação de currículos.";
const LISTA_CURSOS = [
  ["Curso 1", "UNEB", "2022"],
  ["Curso 2", "UFBA", "2017"],
  ["Curso 3", "IFBA", "2000"],
];
const QUALIFICACOES_CURSOS_COMPLEMENTARES =
  "Curso 1 - Instituição 1 - 2002;\nCurso 2 - Instituição 2 - 2000;\nCurso 3 - Instituição 3 - 1900;";
const LISTA_EXPERIENCIA = [
  [
    "Empresa 1",
    "2017",
    "atualmente",
    "Cargo 1",
    "Atuacoes no ramo de automacao;\nBoas acoes para o mundo.",
  ],
  [
    "Empresa 2",
    "2010",
    "2015",
    "Cargo 2",
    "Atuacoes no ramo de automacao;\nBoas acoes para o mundo.",
  ],
  [
    "Empresa 3",
    "2005",
    "2007",
    "Cargo 3",
    "Atuacoes no ramo de automacao;\nBoas acoes para o mundo.",
  ],
];
const ATIVIDADES_COMPLEMENTARES = "Projetos sociais;\nWorkshops;\nCongressos.";
const INFORMACOES_ADICIONAIS =
  "Informações a adicionar;\nLinha 2 de informações;\nLinha 3 de informações.";

//======================INICIA AQUI==========================

async function curriculumBot() {
  try {
    const [contexto, navegador, pagina] = await configsIniciais();

    await pagina.goto(LINK);

    await fecharModalCookies(pagina);

    await preencherPaginaDadosPessoais(pagina);

    await avancarPagina(pagina);

    await preencherPaginaFormacaoAcademica(pagina);

    await avancarPagina(pagina);

    await preencherPaginaExperiencia(pagina);

    await avancarPagina(pagina);

    await preencherPaginaInformacoesAdicionais(pagina);

    await baixarCurriculo(pagina);

    // await aguarde(10000);

    // await navegador.close();
  } catch (erro) {
    console.log(`${await adquirirTempoAgora()} - ${erro}\n`);
    process.exit();
  }
}

async function configsIniciais() {
  if (![1, 2, 3].includes(ESTILO_CURRICULO)) {
    let msg = `O ESTILO_CURRICULO DEVE SER UM VALOR ENTRE 1 E 3. VALOR ATUAL: ${ESTILO_CURRICULO}\n`;
    await escreverLog(msg);
    process.exit();
  }

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

  const caminhoDownload = path.resolve();

  const client = await pagina.target().createCDPSession();

  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: caminhoDownload,
  });

  await escreverLog(`Caminho do download: ${caminhoDownload}`);

  await contexto.overridePermissions(LINK, ["geolocation"]);

  await pagina.setViewport({ width: 1280, height: 800 });

  pagina.setDefaultTimeout(61000);

  return [contexto, navegador, pagina];
}

async function preencherPaginaDadosPessoais(pagina) {
  await pagina.waitForSelector(SELETOR_NOME_COMPLETO);
  await adicionarFoto(pagina);
  await aguardarUploadFoto(pagina);

  await apagarCampo(pagina, SELETOR_NACIONALIDADE);
  await digitarCampo(pagina, NOME_COMPLETO, SELETOR_NOME_COMPLETO);
  await digitarCampo(pagina, EMAIL, SELETOR_EMAIL);
  await digitarCampo(pagina, NACIONALIDADE, SELETOR_NACIONALIDADE);
  await digitarCampo(pagina, IDADE, SELETOR_IDADE);
  await selecionarOpcaoPorTexto(pagina, SELETOR_GENERO, GENERO);
  await selecionarOpcaoPorTexto(
    pagina,
    SELETOR_ESTADO_CIVIL,
    ESTADO_CIVIL.substring(0, ESTADO_CIVIL.length - 3)
  );
  await digitarCampo(pagina, TELEFONE, SELETOR_TELEFONE);
  await digitarCampo(pagina, CELULAR, SELETOR_CELULAR);
  await digitarCampo(pagina, ENDERECO, SELETOR_ENDERECO);
  await digitarCampo(pagina, CIDADE, SELETOR_CIDADE);
  await digitarCampo(pagina, ESTADO, SELETOR_ESTADO);
  await digitarCampo(pagina, CEP, SELETOR_CEP);
  await digitarCampo(pagina, OBJETIVO, SELETOR_OBJETIVO);
}

async function preencherPaginaFormacaoAcademica(pagina) {
  await pagina.waitForSelector(SELETOR_BOTAO_ADICIONAR_OUTRO_CURSO);

  for (let indice = 0; indice < LISTA_CURSOS.length; indice++) {
    let seletorCurso = SELETOR_CURSO.replace("index", indice);
    let seletorInstituicao = SELETOR_INSTITUICAO.replace("index", indice);
    let seletorAnoConclusao = SELETOR_ANO_CONCLUSAO.replace("index", indice);

    await digitarCampo(pagina, LISTA_CURSOS[indice][0], seletorCurso);
    await digitarCampo(pagina, LISTA_CURSOS[indice][1], seletorInstituicao);
    await digitarCampo(pagina, LISTA_CURSOS[indice][2], seletorAnoConclusao);

    if (indice < LISTA_CURSOS.length - 1) {
      await pagina.click(SELETOR_BOTAO_ADICIONAR_OUTRO_CURSO);
      await aguardar(2000);
    }
  }

  await digitarCampo(
    pagina,
    QUALIFICACOES_CURSOS_COMPLEMENTARES,
    SELETOR_QUALIFICACOES_CURSOS_COMPLEMENTARES
  );
}

async function preencherPaginaExperiencia(pagina) {
  await pagina.waitForSelector(SELETOR_BOTAO_ADICIONAR_OUTRA_EXPERIENCIA);
  let trabalhaAtualmenteFlag = false;

  for (let indice = 0; indice < LISTA_EXPERIENCIA.length; indice++) {
    let seletorEmpresa = SELETOR_EMPRESA.replace("index", indice);
    let seletorInicioEmpresa = SELETOR_INICIO_EMPRESA.replace("index", indice);
    let seletorFimEmpresa = SELETOR_FIM_EMPRESA.replace("index", indice);
    let seletorTrabalhaAtualmente =
      SELETOR_TRABALHO_ATUALMENTE_NESTA_EMPRESA.replace("index", indice);
    let trabalhaAtualmente = LISTA_EXPERIENCIA[indice][2]
      .toLowerCase()
      .includes("atual");
    let seletorCargo = SELETOR_CARGO.replace("index", indice);
    let seletorDescricaoAtividades = SELETOR_DESCRICAO_ATIVIDADES.replace(
      "index",
      indice
    );

    if (trabalhaAtualmente) {
      await pagina.click(seletorTrabalhaAtualmente);
      trabalhaAtualmenteFlag = true;
    } else {
      if (trabalhaAtualmenteFlag) {
        await pagina.click(seletorTrabalhaAtualmente);
        trabalhaAtualmenteFlag = false;
      }

      await digitarCampo(
        pagina,
        LISTA_EXPERIENCIA[indice][2],
        seletorFimEmpresa
      );
    }

    await digitarCampo(pagina, LISTA_EXPERIENCIA[indice][0], seletorEmpresa);
    await digitarCampo(
      pagina,
      LISTA_EXPERIENCIA[indice][1],
      seletorInicioEmpresa
    );
    await digitarCampo(pagina, LISTA_EXPERIENCIA[indice][3], seletorCargo);
    await digitarCampo(
      pagina,
      LISTA_EXPERIENCIA[indice][4],
      seletorDescricaoAtividades
    );

    if (indice < LISTA_EXPERIENCIA.length - 1) {
      await pagina.click(SELETOR_BOTAO_ADICIONAR_OUTRA_EXPERIENCIA);
      await aguardar(2000);
    }
  }

  await digitarCampo(
    pagina,
    ATIVIDADES_COMPLEMENTARES,
    SELETOR_ATIVIDADES_COMPLEMENTARES
  );
}

async function preencherPaginaInformacoesAdicionais(pagina) {
  await pagina.waitForSelector(SELETOR_INFORMACOES_ADICIONAIS);
  await digitarCampo(
    pagina,
    INFORMACOES_ADICIONAIS,
    SELETOR_INFORMACOES_ADICIONAIS
  );
}

async function baixarCurriculo(pagina) {
  await pagina.waitForSelector(SELETOR_BOTAO_VER_BAIXAR);
  await pagina.click(SELETOR_BOTAO_VER_BAIXAR);

  await pagina.click(SELETORES_ESTILO_CURRICULO[ESTILO_CURRICULO - 1]);

  await aguardar(2000);

  await pagina.click(SELETOR_BOTAO_BAIXAR_CV);

  await aguardar(5000);

  await escreverLog(
    "Arquivo baixado com sucesso! O Bot esta sendo finalizado..."
  );
  process.exit();
}

//====================FUNCOES AUXILIARES=====================

async function adicionarFoto(pagina) {
  await pagina.click(SELETOR_BOTAO_ADICIONAR_FOTO);

  // if (NOME_ARQUIVO_FOTO) {
  //   const botaoUpload = await pagina.waitForSelector(
  //     SELETOR_BOTAO_ADICIONAR_FOTO
  //   );
  //   await botaoUpload.uploadFile(`./${NOME_ARQUIVO_FOTO}`);
  // }
}

async function aguardarUploadFoto(pagina) {
  while (true) {
    await aguardar(1500);
    await pagina.waitForSelector(SELETOR_IMG);
    let ok = await pagina.evaluate(
      (selector, srcInicial) => {
        const srcAvatarAtual = document.querySelector(selector).src;

        return srcAvatarAtual != srcInicial;
      },
      SELETOR_IMG,
      SRC_AVATAR_INICIAL
    );

    if (ok) {
      break;
    }
  }
}

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

async function escreverLog(stringRecebida) {
  let string = `${await adquirirTempoAgora()} - ${stringRecebida}\n`;

  console.log(string);
}

async function fecharModalCookies(pagina) {
  await pagina.waitForSelector(SELETOR_FECHAR_MODAL_COOKIES);
  await pagina.click(SELETOR_FECHAR_MODAL_COOKIES);
}

async function selecionarOpcaoPorTexto(pagina, seletor, textoBuscado) {
  if (textoBuscado) {
    await pagina.waitForSelector(seletor);

    const opcoes = await pagina.evaluate((selector) => {
      const elementoSelect = document.querySelector(selector);
      const opcoes = Array.from(elementoSelect.options).map((option) => ({
        text: option.text,
        value: option.value,
      }));
      return opcoes;
    }, seletor);

    const opcaoEncontrada = opcoes.find((option) =>
      option.text.toLowerCase().includes(textoBuscado.toLowerCase())
    );

    if (opcaoEncontrada) {
      await pagina.select(seletor, opcaoEncontrada.value);
    } else {
      let erro = `Nenhuma opcao encontrada com o texto incluindo "${textoBuscado}"`;
      await escreverLog(erro);
    }
  }
}

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

const SELETOR_CURSO = '[name="course[index]"]';
const SELETOR_INSTITUICAO = '[name="school[index]"]';
const SELETOR_ANO_CONCLUSAO = '[name="school_conclusion_year[index]"]';
const SELETOR_QUALIFICACOES_CURSOS_COMPLEMENTARES = '[name="other_courses"]';

const SELETOR_EMPRESA = '[name="company[index]"]';
const SELETOR_INICIO_EMPRESA = '[name="company_begin[index]"]';
const SELETOR_FIM_EMPRESA = '[name="company_end[index]"]';
const SELETOR_TRABALHO_ATUALMENTE_NESTA_EMPRESA = "#work_present\\[index\\]";
const SELETOR_CARGO = '[name="company_office[index]"]';
const SELETOR_DESCRICAO_ATIVIDADES = '[name="company_functions[index]"]';
const SELETOR_ATIVIDADES_COMPLEMENTARES = '[name="other_activity"]';

const SELETOR_INFORMACOES_ADICIONAIS = '[name="other_informations"]';

const SELETORES_ESTILO_CURRICULO = [
  '[data-template-id="roma"]',
  '[data-template-id="seul"]',
  '[data-template-id="mumbai"]',
];

const SELETOR_FECHAR_MODAL_COOKIES = "#cookiescript_close";
const SELETOR_BOTAO_ADICIONAR_FOTO = ".form-btn.form-btn-add--item";
const SELETOR_BOTAO_PAG_SEGUINTE = "#btnNext";
const SELETOR_BOTAO_ADICIONAR_OUTRO_CURSO = "#add_course";
const SELETOR_BOTAO_ADICIONAR_OUTRA_EXPERIENCIA = "#add_experience";
const SELETOR_BOTAO_VER_BAIXAR = "#btnPreview";
const SELETOR_BOTAO_BAIXAR_CV = '[name="pdf"]';
const SELETOR_IMG = "#avatar-img";
const SRC_AVATAR_INICIAL = "https://cdn.todacarreira.com/img/avatar.jpg";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TYPING_DELAY = 25;
const MAX_CHARS = 500;

//====================FUNCAO PRINCIPAL======================
await curriculumBot();
