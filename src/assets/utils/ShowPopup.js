export function ShowPopup(popupRef, msgRef, typeRef, msg, type) {
  typeRef.value = type;
  msgRef.value = msg;

  popupRef.value = true;
  setTimeout(() => {
    popupRef.value = false;
    msgRef.value = "";
    typeRef.value = "";
  }, 1000 * 3);
}
