import { ref } from "vue";
import router from "@/router";

export function InitializeVars() {
  const token = localStorage.getItem("token");
  const techName = localStorage.getItem("techName");
  const techColor = localStorage.getItem("techColor");
  const popup = ref(false);
  const msg = ref("");
  const type = ref("");
  const tickets = ref([]);
  const clients = ref([]);
  const techs = ref([]);
  const total = ref(0);
  const clientName = ref("");
  const order = ref("all");

  if (!token) {
    router.push("/");
  }

  return {
    token,
    techName,
    techColor,
    popup,
    msg,
    type,
    tickets,
    clients,
    techs,
    total,
    clientName,
    order,
  };
}
