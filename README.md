# 🔗 Encurtador de Links

Site que transforma URLs enormes em links curtos, com contador de cliques e dados salvos em SQLite.

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
| POST | `/api/shorten` | Body `{ "url": "https://..." }` → cria o link curto |
| GET | `/api/links` | Lista os 50 links mais recentes com cliques |
| GET | `/api/links/:code` | Estatísticas de um link |
| GET | `/:code` | Redireciona e incrementa o contador de cliques |

## Ideias para evoluir
- Códigos personalizados (alias)
- Data de expiração dos links
- Cliques por dia (tabela separada) e gráfico
- Testes automatizados e Docker
- Rate limiting
