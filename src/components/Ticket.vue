<template>
  <div class="container">
    <div class="ticket-container" @click="ticketFocus = !ticketFocus">
      <section class="info-section">
        <h4>Cliente</h4>
        <p><slot name="clientName"></slot></p>
      </section>
      <section class="info-section large">
        <h4>Descrição</h4>
        <p><slot name="description"></slot></p>
      </section>
      <section class="info-section">
        <h4>Prioridade</h4>
        <p :class="priority" class="priority"><slot name="priority"></slot></p>
      </section>
      <section class="info-section">
        <h4>Status</h4>
        <p :class="status" class="status"><slot name="status"></slot></p>
      </section>
      <section class="info-section" v-if="$slots.reccurrent == true">
        <h4>Recorrente</h4>
        <p><slot name="reccurrent"></slot></p>
      </section>
      <section class="info-section" v-if="$slots.techName">
        <h4>Técnico</h4>
        <p><slot name="techName"></slot></p>
      </section>
      <section class="info-section">
        <h4>Criado em</h4>
        <p><slot name="createdAt"></slot></p>
      </section>
    </div>
    <div class="ticket-actions" v-show="ticketFocus">
      <div
        class="action"
        v-if="props.admin == 'true' || props.delete_ticket == 'true'"
        @click="deleteTicket"
      >
        <label>Deletar</label>
        <img src="../assets/icons/trash.png" alt="trash icon" />
      </div>
      <div class="action" v-if="props.ticket.status != 'finished'">
        <label>Finalizar</label>
        <img src="../assets/icons/check.png" alt="check icon" />
      </div>
      <div class="action" v-if="props.ticket.status == 'finished'">
        <label>Abrir novamente</label>
        <img src="../assets/icons/reload.png" alt="reload icon" />
      </div>
      <div class="action" v-if="props.ticket.status == 'open'">
        <label>Marcar em progresso</label>
        <img
          src="../assets/icons/progress.png"
          alt="progress icon"
          style="width: 4rem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { baseUrl } from "../../conf";

const props = defineProps({
  ticket: {},
  admin: Boolean,
  delete_ticket: Boolean,
});

const emit = defineEmits(["ticket_deleted"]);

const popup = ref(false);
const msg = ref("");
const type = ref("");

const ticketFocus = ref(false);

const priority = computed(() => {
  switch (props.ticket.priority) {
    case "urgent":
      return "urgent-priority";
    case "high":
      return "high-priority";
    case "medium":
      return "medium-priority";
    case "low":
      return "low-priority";
  }
});

const status = computed(() => {
  switch (props.ticket.status) {
    case "open":
      return "open-status";
    case "progress":
      return "progress-status";
    case "finished":
      return "finished-status";
  }
});

async function deleteTicket() {
  const res = await fetch(baseUrl + "/ticket/delete", {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: props.ticket.id,
    }),
  });

  const data = await res.json();

  if (res.status == 200) {
    msg.value = "Ticket deletado com sucesso";
    type.value = "success";
    emit("ticket_deleted");
  } else if (res.status == 401) {
    msg.value = "Ops! algo deu errado.";
    type.value = "error";
    console.error(data);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
}

.ticket-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dark-background);
  padding: 1rem 3rem;
  border-radius: 1.2rem;
  cursor: pointer;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  width: 20%;
}

.large {
  width: 40%;
}

.ticket-actions {
  margin-top: -1rem;
  width: 100%;
  background: var(--medium-background);
  padding: 1rem 3rem;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5rem;
}

.ticket-actions .action {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
}

.popup {
  position: absolute;
  top: 3rem;
}

.status {
  padding: 0.3rem 0.7rem;
  border-radius: 1.2rem;
}

.priority {
  padding: 0.3rem 0.7rem;
  border-radius: 1.2rem;
}

.urgent-priority {
  background: #d83f3f94;
}

.high-priority {
  background: #d89b3f94;
}

.medium-priority {
  background: #3fd8b794;
}

.low-priority {
  background: #59d83f94;
}

.open-status {
  background: #d83f3f94;
}

.progress-status {
  background: #d89b3f94;
}

.finished-status {
  background: #59d83f94;
}
</style>
