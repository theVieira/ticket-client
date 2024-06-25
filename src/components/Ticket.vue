<template>
  <div class="ticket-container" @click="ticketActions">
    <section class="info-section">
      <h4>Cliente</h4>
      <p><slot name="clientName"></slot></p>
    </section>
    <section class="info-section large">
      <h4>Descrição</h4>
      <p><slot name="description"></slot></p>
    </section>
    <section class="info-section">
      <h4>Status</h4>
      <p><slot name="status"></slot></p>
    </section>
    <section class="info-section" v-if="$slots.reccurrent">
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
      v-if="props.permissions.admin || props.permissions.delete_ticket"
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
</template>

<script setup>
import { ref } from "vue";
import { baseUrl } from "../../conf";

const props = defineProps({
  ticket: {},
  permissions: {},
});

const ticketFocus = ref(false);

function ticketActions() {
  ticketFocus.value = !ticketFocus.value;
}

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
  console.log(data);
}
</script>

<style scoped>
.ticket-container {
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
}

.large {
  max-width: 40%;
  width: fit-content;
}

.ticket-actions {
  margin-top: -1rem;
  width: 100%;
  background: #121518;
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
</style>
