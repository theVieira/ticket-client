import { onMounted } from 'vue'

export function SetTitle(title) {
  onMounted(() => {
    document.title = title
  })
}
