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
- fases explicitas de turno introduzidas no prototipo
- regras consultaveis a qualquer momento integradas na UI
- interacoes do turno agora bloqueadas por fase
- infraestrutura E2E com Playwright integrada na webapp
- board interativo: clicar num local durante fase de Acao seleciona a acao correspondente
- drag and drop de localizacoes: locais do board agora podem ser arrastados para uma zona de alvo do turno para escolher acao
- 2 sobreviventes adicionados (Leonor Vilar e Duarte Caeiro), colonia agora com 6 membros
- gestao de equipa: roster + party slots com drag and drop (swap, remover, bloqueado por fase)
- 3 eventos novos integrados do markdown: Sopa Racionada, Farmacia Afundada, Vozes no Nevoeiro
- cobertura E2E expandida: drag de cartas para abrigo + selecao de local no tabuleiro por fase
- 6 eventos novos escritos em markdown (abrigo + exploracao) adicionados a `content/narrative/events/`

## Em Curso

- aprofundar o comportamento das regras e consequencias por fase
- expandir conteudo: de 6 para 12+ eventos, objetivos pessoais por sobrevivente
- ligar party slots a efeitos de resolucao (risco, tensao, loot por membro)
- ligar selecao de local (target) a validacao na engine (acao <-> local)

### Tabuleiro 3D Interativo

- [x] tabuleiro 3D com perspectiva isometrica (Three.js / React Three Fiber)
- [x] controlos de camara: zoom (scroll), pan, rotacao de perspectiva (OrbitControls)
- [x] fundo atmosferico: neve a cair, pinheiros na encosta, nevoa noturna, ceu negro
- [x] zona de jogador abaixo do tabuleiro com cartas de mao
- [x] assets reais low-poly (Kenney CC0): edificios, vedacoes, props de sobrevivencia
- [x] colonia central com edificios reais, vedacao fortified, fogueira, torre de guarda
- [x] cada local tem edificio proprio: farmacia, torre observacao, capela, portao
- [ ] drag and drop de cartas dentro do espaco 3D com snap para zonas validas
- [ ] afinar escala e iluminacao dos edificios GLB no browser

### Multiplayer (fase futura)

- [ ] cada jogador tem a sua zona à volta do tabuleiro (inspirado em board game fisico na mesa)
- [ ] perspectiva rotativa por jogador: cada um ve o tabuleiro do seu lado
- [ ] cartas de mao privadas por jogador, visiveis apenas ao proprio
- [ ] indicacao visual de qual o lado de cada jogador na mesa digital

## Proximo

- definir papeis de agentes/developers
- ligar escolhas, consequencias e recursos a estado real
- escrever mais eventos de abrigo e exploracao
- introduzir locais exploraveis e mapa inicial
- preparar dados estruturados em `json` ou `ts`

## Bloqueios

- Playwright E2E pode falhar em ambientes sandbox sem acesso a loopback (erro `connect EPERM 127.0.0.1:3100`)

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
- o prototipo ja tem ordem de turno explicita e regras acessiveis em UI
- o projeto ja tem testes E2E para validar interacoes reais no browser

## Backlog Curto

1. Definir mundo, tom e ameaca principal.
2. Definir sessao-alvo e numero de jogadores do MVP.
3. Desenhar estruturas de dados para personagens, eventos e itens.
4. Escolher stack tecnica.
5. Preparar prompts/agentes por area.

## Log

### 2026-04-14

- board interativo: locais clicaveis durante fase de Acao para selecionar a acao do turno
- drag and drop de localizacoes: locais do tabuleiro agora podem ser arrastados para escolher acao do turno
- colonia expandida para 6 sobreviventes com Leonor Vilar e Duarte Caeiro
- party slots: roster + equipa do turno com drag and drop, swap e remover
- 3 eventos do markdown integrados na app (Sopa Racionada, Farmacia Afundada, Vozes no Nevoeiro)
- 6 eventos novos escritos em markdown (abrigo + exploracao) adicionados a `content/narrative/events/`
- queue de eventos passa de 3 para 6 entradas
- condicoes de vitoria e derrota implementadas (moral 0, mantimentos 0, pressao 100, objetivo completo)
- sistema de loot por acao: cada acao pode gerar uma carta nova na mao do jogador
- itens expandidos de 3 para 12 (antibioticos, vendas, combustivel, fio eletrico, racao, sinalizador, documentos, manta termica)
- ecra de fim de jogo com estado, turnos sobrevividos e opcao de reiniciar
- E2E: testes novos para drag cartas -> abrigo e selecao de local no tabuleiro por fase

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
- definicao da primeira camada de regras temporais e consulta de regras no jogo
- integracao inicial de Playwright para testes end-to-end
