# curriculum-bot
- Bot de automação para a criação de currículos. 
- Créditos à plataforma https://www.todacarreira.com/gerador-de-curriculo/ pela geração do currículo e disponibilização do download.

## Instalação
- [INSTALAR] - npm i
- [ATUALIZAR] - Atualize suas informações a serem geradas no currículo no arquivo index.js

## Uso
- [INICIAR] - npm run start

## Sobre as informações a serem atualizadas no arquivo index.js:
- [ESTILO_CURRICULO] - Selecione um valor de 1 a 3, sem aspas, somente o número.
- [GENERO] - O site apenas aceita os valores "Masculino" e "Feminino". Entretanto, é possível deixar em branco, para isso, deixe o valor como "".
- [ESTADO_CIVIL] - O site apenas aceita os valores "Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)" e "Separado(a)". Entretanto, é possível deixar em branco, para isso, deixe o valor como "".
 - [CEP] - Deve ser no formato indicado no arquivo: "41234-567".
 - [OBJETIVO]/[QUALIFICACOES_CURSOS_COMPLEMENTARES]/[LISTA_EXPERIENCIA]/[ETC] - O texto deve estar totalmente dentro das aspas "". Para pular uma linha, simplesmente digite /n e continue o texto. O arquivo já possui bons exemplos.
 - [LISTA_CURSOS]/[LISTA_EXPERIENCIA] - Coloque em ordem descrescente (do mais recente para o mais antigo).