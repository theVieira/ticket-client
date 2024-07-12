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
        <h4>Categoria</h4>
        <p class="category"><slot name="category"></slot></p>
      </section>
      <section class="info-section">
        <h4>Status</h4>
        <p :class="status" class="status"><slot name="status"></slot></p>
      </section>
    </div>
    <div class="ticket-actions" v-show="ticketFocus">
      <div class="more-infos">
        <section class="more-info" v-if="$slots.reccurrent">
          <h4>Recorrente</h4>
          <p v-show="false">
            <slot name="reccurrent"></slot>
          </p>
          <img
            src="../assets/icons/check.png"
            alt="check icon"
            class="checkReccurrent"
          />
        </section>
        <section class="more-info" v-if="$slots.techName">
          <h4>Técnico</h4>
          <p :style="{ color: tech_color }"><slot name="techName"></slot></p>
        </section>
        <section class="more-info">
          <h4>Criado em</h4>
          <p><slot name="createdAt"></slot></p>
        </section>
        <section class="more-info" v-if="ticket.status != 'open'">
          <h4>Atualizado em</h4>
          <p><slot name="updatedAt"></slot></p>
        </section>
      </div>
      <div class="actions">
        <div
          class="action"
          v-if="admin == 'true'"
          @click="editTicket(ticket.id)"
        >
          <p>Editar</p>
          <img src="../assets/icons/pencil.png" alt="pencil icon" />
        </div>
        <div
          class="action"
          v-if="admin == 'true' || delete_ticket == 'true'"
          @click.prevent="deleteTicket(ticket)"
        >
          <p>Deletar</p>
          <img src="../assets/icons/trash.png" alt="trash icon" />
        </div>
        <div
          class="action"
          v-if="props.ticket.status != 'finished'"
          @click="setFinishedTicket(ticket.id)"
        >
          <p>Finalizar</p>
          <img src="../assets/icons/check.png" alt="check icon" />
        </div>
        <div
          class="action"
          v-if="props.ticket.status == 'finished'"
          @click="reopen(ticket.id)"
        >
          <p>Abrir novamente</p>
          <img src="../assets/icons/reload.png" alt="reload icon" />
        </div>
        <div
          class="action"
          v-if="props.ticket.status == 'open'"
          @click.prevent="setProgressTicket(ticket.id)"
        >
          <p>Marcar em progresso</p>
          <img
            src="../assets/icons/progress.png"
            alt="progress icon"
            style="width: 4rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { baseUrl } from "../../conf";
import { Translate } from "@/assets/utils/Translate";

const ticketFocus = ref(false);

const token = localStorage.getItem("token");

const admin = localStorage.getItem("admin");
const delete_ticket = localStorage.getItem("delete_ticket");
const tech_color = localStorage.getItem("color");

const props = defineProps({
  ticket: {},
});

const emit = defineEmits([
  "ticket_deleted",
  "ticket_progress",
  "ticket_finished",
  "ticket_reopen",
  "ticket_edited",
]);

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

async function deleteTicket(ticket) {
  const confirmation = confirm(
    `Deseja realmente deletar este chamado?\n\nCliente: ${
      ticket.clientName
    }\nDescrição: ${ticket.description}\nPrioridade: ${Translate(
      ticket.priority
    )}`
  );
  if (confirmation == true) {
    const res = await fetch(baseUrl + "/ticket/delete", {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.ticket.id,
      }),
    });

    const data = await res.json();

    if (res.status == 200) {
      emit("ticket_deleted");
    } else {
      console.error(data);
    }
  }
}

async function setProgressTicket(id) {
  const res = await fetch(baseUrl + "/ticket/progress", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      techName: localStorage.getItem("techName"),
    }),
  });

  const data = await res.json();

  if (res.status == 200) {
    emit("ticket_progress");
  } else {
    console.error(data);
  }
}

async function setFinishedTicket(id) {
  const res = await fetch(baseUrl + "/ticket/finished", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      techName: localStorage.getItem("techName"),
    }),
  });

  const data = await res.json();

  if (res.status == 200) {
    emit("ticket_finished");
  } else {
    console.error(data);
  }
}

async function reopen(id) {
  const res = await fetch(baseUrl + "/ticket/reopen", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });

  const data = await res.json();

  if (res.status == 200) {
    emit("ticket_reopen");
  } else {
    console.error(data);
  }
}

async function editTicket(id) {
  const description = prompt("Insira a descrição");
  const res = await fetch(baseUrl + "/ticket/edit", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      description,
    }),
  });

  const data = await res.json();

  if (res.status != 200) {
    console.error(data);
  } else {
    emit("ticket_edited", { id: data.id, description: data.description });
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
  align-items: self-start;
  justify-content: center;
  background: var(--dark-background);
  padding: 1rem 3rem;
  border-radius: 1.2rem;
  flex-wrap: wrap;
  gap: 3rem;
  cursor: pointer;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  flex-basis: 10rem;
  flex-shrink: 0;
  flex-grow: 1;
}

.ticket-actions {
  margin-top: -1rem;
  width: 100%;
  background: var(--light-background);
  padding: 2rem;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ticket-actions .actions {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ticket-actions .more-infos {
  display: flex;
  gap: 3rem;
  white-space: nowrap;
  padding: 0 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.ticket-actions .action {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: center;
}

.more-info {
  display: flex;
  gap: 1rem;
  align-items: center;
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

.checkReccurrent {
  width: 2.5rem;
}

@media (max-width: 900px) {
  .ticket-container {
    padding: 3rem;
    border: 1px solid #c25005;
  }
  .ticket-actions {
    gap: 3rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .action {
    gap: 0;
  }
}
</style>
