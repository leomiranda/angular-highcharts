![image](https://github.com/user-attachments/assets/4fa13885-8843-423b-8c3b-25b1cf33c455)


# PlenoAngularTest
Como usuário gostaria de ter um seletor de pontos, e ao selecionar um ponto, gostaria de que um gráfico de highcharts fosse exibido mostrando os dados de precipitação passados e futuros. No gráfico gostaria de que houvesse a possibilidade de navegar entre dados diários e horarios. Também gostaria de poder ver somente de 12 em 12 horas, podendo navegar para frente e para trás. No caso de diário, somente 7 dias para frente e para trás. 

## Critérios de aceite

- Estará pronto quando o seletor de pontos estiver funcionando e o gráfico de highcharts estiver exibindo os dados de precipitação passados e futuros.
- O gráfico de highcharts deverá ter a possibilidade de navegar entre dados diários e horários.
- O gráfico de highcharts deverá ter a possibilidade de ver somente de 12 em 12 horas, podendo navegar para frente e para trás.
- O gráfico de highcharts deverá ter a possibilidade de ver somente 7 dias para frente e para trás.
- Gerar uma UX simples e agradavel para o usuário.

## Observações técnicas

- Existe um arquivo em `src/assets/mock-data.json` que contém os dados meteorológicos de 5 pontos. Esses dados são reais removidos de uma das nossas plataformas.
- Cada ponto tem um objeto forecast que contém os dados de previsão. station que contém os dados coletados por estação (dados passados portanto) e locations que contém as informações sobre aquele ponto.
- Nos dados de forecast a estrutura seguida a da meteoblue: documentação em [https://docs.meteoblue.com/en/weather-apis/forecast-api/forecast-data]
- Os dados de station seguem a estrutura de dados da fieldclimate: documentação em [https://api.fieldclimate.com/v2/docs/]
- O gráfico de highcharts é uma biblioteca de gráficos em javascript. Documentação em [https://www.highcharts.com/docs/index]

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
