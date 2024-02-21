# curriculum-bot
- Bot de automação para a criação de currículos. 
- Créditos à plataforma https://www.todacarreira.com/gerador-de-curriculo/ pela geração do currículo e disponibilização do download.

## Instalação
- [INSTALAR] - npm i
- [ATUALIZAR] - Atualize suas informações a serem geradas no currículo no arquivo index.js

## Uso
- [INICIAR] - npm run start

## Sobre as informações a serem atualizadas no arquivo index.js:
- [TODOS_OS_CAMPOS] - Caso queira deixar algum campo em branco, deixe apenas as aspas sem conteúdo: "".
- [ESTILO_CURRICULO] - Selecione um valor de 1 a 3, sem aspas, somente o número.
- [GENERO] - O site apenas aceita os valores "Masculino" e "Feminino". Entretanto, é possível deixar em branco.
- [ESTADO_CIVIL] - O site apenas aceita os valores "Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)" e "Separado(a)".
- [CEP] - Deve ser no formato indicado no arquivo: "41234-567".
- [LISTA_CURSOS]/[LISTA_EXPERIENCIA] - Coloque em ordem descrescente (do mais recente para o mais antigo).
- [LISTA_EXPERIENCIA] - No terceiro valor entre aspas dentro de cada lista, você pode optar entre colocar "atualmente" ou o ano de conclusão do curso. O interessante é que somente o primeiro da lista, o mais recente, possa estar como "atualmente" ou não.
- [OBJETIVO]/[LISTA_EXPERIENCIA]/[ETC] - O texto deve estar totalmente dentro das aspas "". Para pular uma linha, simplesmente digite \n e continue o texto. O arquivo já possui bons exemplos.