# Tech Stack

## Recomendacao Inicial

Para o primeiro prototipo de `A Longa Noite`, a stack recomendada e:

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `React` para UI e fluxo de jogo
- `Zustand` para estado de jogo local

## Porque Esta Stack

- acelera a criacao de uma app de browser moderna
- permite um dashboard complexo sem introduzir ja uma engine mais pesada
- facilita crescimento para autenticacao, persistencia e multiplayer mais tarde
- da-nos uma base solida para conteudo orientado a dados

## Arquitetura Inicial

- `app/` ou `src/app/`: paginas e fluxo principal
- `components/`: UI reutilizavel
- `features/game/`: logica do loop de jogo
- `features/shelter/`: estado do abrigo
- `features/survivors/`: personagens e estados
- `features/events/`: eventos e resolucao narrativa
- `data/`: dados estaticos e fixtures
- `lib/`: utilitarios e helpers

## Estado de Jogo

O primeiro slice deve funcionar localmente, sem backend obrigatorio. O estado pode viver em memoria e, numa segunda iteracao, ser persistido em `localStorage`.

Entidades base:

- `GameState`
- `ShelterState`
- `Survivor`
- `InventoryItem`
- `EventCard`
- `Location`
- `ThreatState`

## Multiplayer Mais Tarde

Quando o vertical slice estiver validado, a evolucao natural e:

- `Supabase` para auth e persistencia
- realtime para sincronizacao simples
- salas e saves por sessao

## Regra de Implementacao

Antes de adicionar backend, devemos provar:

- o loop de turno
- a leitura do dashboard
- a resolucao de eventos
- a clareza do estado de jogo
