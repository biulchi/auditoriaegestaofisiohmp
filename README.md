# Sistema de Auditoria e Gestão HMP - Fisioterapia

Sistema web para gestão e auditoria do setor de Fisioterapia do Hospital Municipal de Paracatu.

## Funcionalidades

### 1. Sistema de Auditoria em Ventilação Mecânica
- Registro de auditorias diárias
- Dashboard com indicadores de conformidade
- Análise por leito e por item de auditoria
- Exportação de dados para Excel

### 2. Gestão de Indicadores Fisioterapia
- Registro de indicadores diários
- Dashboard com gráficos e métricas
- Monitoramento de:
  - Taxa de PAV
  - Mobilização precoce
  - Extubações e falhas
  - Admissões e altas
  - Eventos adversos

### 3. Ponto Eletrônico
- Registro de entrada e saída
- Relatório individual
- Relatório geral (admin)
- Impressão de folha de ponto

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- ShadcnUI
- Recharts

## Instalação

```bash
# Clone o repositório
git clone https://github.com/biulchi/sistema-auditoria-hmp.git

# Entre no diretório
cd sistema-auditoria-hmp

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## Licença

MIT
