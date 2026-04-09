# Progress

## Estado Atual

Fase: Fundacoes

Sprint atual: definicao do projeto e preparacao da base documental

## Feito

- nome de trabalho escolhido: `A Longa Noite`
- repositorio inicial ligado
- estrutura base de pastas criada
- roadmap inicial escrito
- documento de design inicial escrito
- guia editorial pt-pt criado
- registo de assets criado
- identidade inicial do mundo definida
- escopo do MVP fechado
- templates base de conteudo criados
- 6 personagens iniciais escritas
- 6 eventos iniciais escritos
- 4 itens iniciais definidos
- base tecnica da webapp criada em `web/`
- dashboard inicial do vertical slice implementado
- store inicial com `zustand` configurada
- primeira resolucao de turno implementada no prototipo
- testes iniciais de logica e UI configurados e a passar
- pipeline GitHub Actions criada para lint, testes e build
- evento ativo com escolhas reais ligado ao loop do turno
- consequencias narrativas e mecanicas registadas no historico
- mapa inicial com localizacoes integrado no dashboard
- objetivo principal da sessao ligado ao progresso de turno
- primeira vista de tabuleiro integrada na webapp
- localizacoes, rotas e abrigo central agora visiveis como board
- primeira linguagem visual de cartas integrada no prototipo
- recursos apresentados como cartas de board game digital
- drag and drop inicial de cartas para o abrigo implementado
- zona de drop do abrigo ligada a estado simples de mao/inventario

## Em Curso

- expandir conteudo concreto do vertical slice
- transformar markdown de conteudo em dados consumiveis pela app
- definir a proxima camada do loop jogavel
- introduzir locais exploraveis e objetivo principal real
- aproximar dados de jogo de formatos estruturados reaproveitaveis
- usar o board para selecao e interacao direta com localizacoes
- ligar cartas a inventario e loot do turno
- usar drag and drop tambem para localizacoes e sobreviventes

## Proximo

- definir papeis de agentes/developers
- ligar escolhas, consequencias e recursos a estado real
- escrever mais eventos de abrigo e exploracao
- introduzir locais exploraveis e mapa inicial
- preparar dados estruturados em `json` ou `ts`

## Bloqueios

- nenhum bloqueio tecnico neste momento

## Decisoes Tomadas

- o projeto sera escrito em portugues europeu
- o jogo procurara a sensacao de survival board game sem copiar IP existente
- multiplayer entra depois do vertical slice offline
- assets devem ter licenca clara e registada
- a app web vive na pasta `web/`
- o prototipo usa `Next.js`, `TypeScript`, `Tailwind` e `zustand`
- a qualidade automatica minima inclui `lint`, `test` e `build` em CI
- o prototipo ja suporta escolhas de evento com impacto mecanico
- o prototipo ja mostra progresso de sessao e estado do mapa
- o prototipo ja tem uma representacao visual de tabuleiro
- o prototipo ja mistura tabuleiro, dashboard e cartas
- o prototipo ja suporta interacao fisica basica com cartas

## Backlog Curto

1. Definir mundo, tom e ameaca principal.
2. Definir sessao-alvo e numero de jogadores do MVP.
3. Desenhar estruturas de dados para personagens, eventos e itens.
4. Escolher stack tecnica.
5. Preparar prompts/agentes por area.

## Log

### 2026-04-09

- arranque do repositorio
- criacao da base documental
- definicao inicial do mundo, da ameaca principal e do abrigo
- criacao do documento de MVP
- criacao de templates para personagens, eventos e itens
- escrita das primeiras personagens, eventos e itens de referencia
- criacao da webapp e do dashboard inicial do vertical slice
- implementacao da primeira camada jogavel de resolucao de turno
- criacao de testes iniciais e pipeline de CI
- ligacao do evento ativo a escolhas e consequencias reais
- integracao do objetivo principal e do mapa inicial na experiencia jogavel
- criacao da primeira camada visual de board game digital
- criacao das primeiras cartas visuais de recurso
- introducao de drag and drop para cartas no single player
