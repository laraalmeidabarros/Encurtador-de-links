# 🔗 Encurtador de Links

Site que transforma URLs enormes em links curtos, com contador de cliques e dados salvos em SQLite.

## Funcionalidades
- Encurta URLs longas em links curtos
- Alias personalizado (ex.: `/meu-portfolio`)
- Contador de cliques
- Dados salvos em SQLite

## Tecnologias
- JavaScript
- Node.js + Express
- SQLite (better-sqlite3)

## Como rodar
```bash
npm install
npm start
```
Acesse http://localhost:3000

## Variáveis de ambiente (opcionais)
| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta do servidor |
| `BASE_URL` | `http://localhost:PORT` | Domínio usado nos links curtos |

## API
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/shorten` | Body `{ "url": "https://...", "alias": "meu-link" }` (alias opcional) → cria o link curto |
| GET | `/api/links` | Lista os 50 links mais recentes com cliques |
| GET | `/api/links/:code` | Estatísticas de um link |
| GET | `/:code` | Redireciona e incrementa o contador de cliques |

## Ideias para evoluir
- Data de expiração dos links
- Cliques por dia (tabela separada) e gráfico
- Testes automatizados e Docker
- Rate limiting
