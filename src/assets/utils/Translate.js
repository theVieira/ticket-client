export function Translate(string) {
  switch (string) {
    case 'open':
      return 'Aberto'
    case 'progress':
      return 'Em andamento'
    case 'finished':
      return 'Finalizado'
    case 'urgent':
      return 'Urgente'
    case 'high':
      return 'Alta'
    case 'medium':
      return 'Normal'
    case 'low':
      return 'Baixa'
    case 'daily':
      return 'Diário'
    case 'delivery':
      return 'Entrega'
    case 'budget':
      return 'Orçamento'
  }
}
