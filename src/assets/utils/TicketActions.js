import { InitializeVars } from './InitializeVars'
import { ShowPopup } from './ShowPopup'

const { techName } = InitializeVars()
const msgError = 'Ops! Ocorreu um erro!'

const deleteTicket = (array, id, popupRef, msgRef, typeRef, status) => {
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else {
    const i = array.value.findIndex((el) => el.id == id)
    array.value.splice(i, 1)
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket deletado com sucesso!', 'success')
  }
}

const progressTicket = (array, id, popupRef, msgRef, typeRef, status) => {
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else {
    const i = array.value.findIndex((el) => el.id == id)
    array.value[i].status = 'progress'
    array.value[i].techName = techName
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket em progresso!', 'success')
  }
}

const finishedTicket = (array, id, popupRef, msgRef, typeRef, status, remove) => {
  const i = array.value.findIndex((el) => el.id == id)
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else if (remove) {
    array.value.splice(i, 1)
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket finalizado com sucesso!', 'success')
  } else {
    array.value[i].status = 'finished'
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket finalizado com sucesso!', 'success')
  }
}

const reopenTicket = (array, id, popupRef, msgRef, typeRef, status, remove) => {
  const i = array.value.findIndex((el) => el.id == id)
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else if (remove == true && status == 200) {
    array.value.splice(i, 1)
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket reaberto com sucesso!', 'success')
  } else if (remove == false && status == 200) {
    array.value[i].status = 'open'
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket reaberto com sucesso!', 'success')
  }
}

const editTicket = (array, id, popupRef, msgRef, typeRef, data, status) => {
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else {
    const i = array.value.findIndex((el) => el.id == id)
    array.value[i].description = data.description
    array.value[i].category = data.category
    array.value[i].status = data.status
    array.value[i].techName = data.techName ?? undefined
    ShowPopup(popupRef, msgRef, typeRef, 'Ticket editado com sucesso!', 'success')
  }
}

const notedTicket = (array, id, popupRef, msgRef, typeRef, data, status) => {
  if (status != 200) {
    ShowPopup(popupRef, msgRef, typeRef, msgError, 'error')
  } else {
    const i = array.value.findIndex((el) => el.id == id)
    array.value[i].note = data.note
    ShowPopup(popupRef, msgRef, typeRef, 'Anotação salva!', 'success')
  }
}

export {
  deleteTicket,
  progressTicket,
  finishedTicket,
  reopenTicket,
  editTicket,
  notedTicket,
}
