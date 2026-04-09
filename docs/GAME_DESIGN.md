# Game Design

## Elevator Pitch

`A Longa Noite` e um jogo de browser de sobrevivencia narrativa em que um grupo isolado tenta resistir ao colapso de um inverno hostil. O jogador gere pessoas, recursos, conflitos e ameacas exteriores enquanto enfrenta escolhas morais e objetivos nem sempre alinhados.

## Fantasia Central

Um antigo posto de montanha, transformado em colonia improvisada, tenta sobreviver a um inverno sem fim depois de uma catastrofe desconhecida ter partido o pais em bolsos isolados. La fora vagueiam os `Ermos`, figuras deformadas pelo frio, pela fome e por algo pior que ninguem compreende bem. Ca dentro, o perigo nao desaparece: cresce.

## Pilares

- tensao permanente
- sobrevivencia coletiva
- escolhas com custo humano
- informacao clara, consequencias duras
- alta rejogabilidade via eventos e objetivos

## Identidade Propria

Para evitar dependencia criativa de referencias existentes, o jogo deve afirmar:

- mundo, faccoes, personagens e lore originais
- terminologia propria
- estrutura de eventos e objetivos original
- direcao artistica propria

### Elementos Originais Base

- o abrigo principal chama-se `Estacao Vaga-Lume`
- a ameaca exterior principal sao os `Ermos`
- o grande misterio narrativo gira em torno do `Silencio Branco`, um fenomeno que apaga estradas, radio e memoria coletiva
- o conflito humano nao e apenas entre egoismo e cooperacao, mas tambem entre verdade, fe e controlo

## Core Loop Inicial

1. Ler o estado do abrigo no dashboard.
2. Gerir recursos e prioridades.
3. Atribuir acoes aos sobreviventes.
4. Resolver exploracao, risco e encontros.
5. Aplicar consequencias no abrigo.
6. Resolver evento narrativo.
7. Avancar o turno e verificar moral, frio e pressao externa.

### Estrutura de Turno do MVP

1. Fase de crise: verificar frio, fome, doenca e consumo do abrigo.
2. Fase de comando: distribuir sobreviventes por tarefas e locais.
3. Fase de acao: executar scavenging, reforco, cuidados, vigia e deslocacao.
4. Fase de risco: resolver ruido, encontros, ataques e acidentes.
5. Fase narrativa: apresentar um evento de abrigo ou exploracao.
6. Fase de fecho: aplicar moral, progresso do objetivo e estado global.

## Sistemas do MVP

- sobreviventes
- abrigo
- recursos
- moral
- frio
- fome
- ruido/ameaca
- combate simples
- eventos narrativos
- objetivo principal
- objetivos pessoais simples

### Sistemas Confirmados para o Primeiro Slice

- 1 abrigo central: `Estacao Vaga-Lume`
- 4 locais exteriores exploraveis no prototipo
- 6 sobreviventes jogaveis
- 1 faccao humana secundaria hostil ou ambigua
- 1 categoria principal de ameaca exterior: `Ermos`
- 1 relogio global de deterioracao chamado `Pressao da Noite`
- inventario simples por abrigo e por personagem
- relacoes basicas entre personagens

## Tipos de Conteudo

- personagens
- eventos de abrigo
- eventos de exploracao
- itens
- locais
- ameacas/inimigos
- objetivos

### Conteudo Alvo do Vertical Slice

- 6 personagens completas
- 12 eventos de abrigo
- 12 eventos de exploracao
- 8 itens utilitarios
- 4 armas improvisadas
- 4 locais visitaveis
- 1 objetivo principal
- 6 objetivos pessoais simples

## UI / UX

O dashboard deve privilegiar leitura rapida e atmosfera:

- estado do abrigo sempre visivel
- retratos marcantes para personagens e inimigos
- prioridade visual para risco, moral e recursos
- historico de eventos e decisoes
- apresentacao cinematica dos momentos narrativos

### Areas-Chave do Dashboard

- painel de estado do abrigo
- retratos e estado dos sobreviventes
- mapa/localizacoes acessiveis
- feed narrativo da sessao
- zona de decisao contextual para eventos e encontros
- indicadores fortes para frio, mantimentos, moral e pressao

## Multiplayer

Nao entra no primeiro slice tecnico, mas deve ser previsto no design:

- turnos claros
- acoes auditaveis
- estado sincronizavel
- espaco para chat e negociacao

## Decisoes Atuais de Design

- sessao-alvo do vertical slice: 45 a 90 minutos
- numero de jogadores no MVP tecnico: 1 jogador local
- numero de sobreviventes ativos por sessao: 3 a 6
- estrutura social: cooperacao tensa, sem traidor formal no primeiro slice
- aleatoriedade: moderada, sempre com contexto visivel e consequencias legiveis

## Perguntas em aberto

- qual e a origem exata do `Silencio Branco`?
- como se distingue mecanicamente uma relacao forte de uma relacao fragil?
- que tipo de progresso meta faz sentido sem destruir a dureza das sessoes?
