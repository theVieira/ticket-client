<template>
  <div class="container">
    <div class="ticket-container" @click="showTicketInfos">
      <section class="info-section">
        <h4>Cliente</h4>
        <p>{{ ticket.clientName.toUpperCase() }}</p>
      </section>
      <section class="info-section large">
        <h4>Descrição</h4>
        <p v-show="!editShow">{{ ticket.description }}</p>
        <input
          placeholder="Insira a nova descrição"
          type="text"
          name="editDescription"
          id="editDescription"
          v-show="editShow"
          v-model="description"
          class="edit"
        />
      </section>
      <section class="info-section">
        <h4>Prioridade</h4>
        <p :class="priority" class="priority">
          {{ Translate(ticket.priority).toUpperCase() }}
        </p>
      </section>

      <section class="info-section">
        <h4>Status</h4>
        <p :class="status" class="status">
          {{ Translate(ticket.status).toUpperCase() }}
        </p>
      </section>
    </div>
    <div class="ticket-actions" v-show="ticketFocus">
      <div class="more-infos">
        <section class="more-info">
          <h4>Categoria</h4>
          <p class="category" v-show="!editShow">
            {{ Translate(ticket.category).toUpperCase() }}
          </p>
          <select
            name="edit"
            id="editCategory"
            v-show="editShow"
            v-model="category"
            class="edit"
          >
            <option value="" selected disabled>Selectione</option>
            <option value="daily">Diário</option>
            <option value="delivery">Entrega</option>
            <option value="budget">Orçamento</option>
          </select>
        </section>
        <section class="more-info" v-if="ticket.reccurrent">
          <h4>Recorrente</h4>
          <img
            src="../assets/icons/check.png"
            alt="check icon"
            class="checkReccurrent"
          />
        </section>
        <section class="more-info">
          <h4>Criado em</h4>
          <p>{{ FormatDate(ticket.createdAt) }}</p>
        </section>
        <section class="more-info" v-if="ticket.techName">
          <h4>Técnico</h4>
          <section :style="{ color: ticket.techColor }">
            {{ ticket.techName.toUpperCase() }}
          </section>
        </section>
        <section class="more-info" v-if="ticket.status != 'open'">
          <h4>Atualizado em</h4>
          <p>{{ FormatDate(ticket.updatedAt) }}</p>
        </section>
      </div>
      <div class="actions">
        <div
          class="action"
          v-if="admin == 'true' && !editShow"
          @click="editShow = true"
        >
          <p>Editar</p>
          <img src="../assets/icons/pencil.png" alt="pencil icon" />
        </div>
        <div class="editActions" v-if="editShow && admin == 'true'">
          <div class="action" @click="saveEdited(ticket.id)">
            <p>Salvar</p>
            <img src="../assets/icons/save.png" alt="save icon" />
          </div>
          <div class="action" v-show="editShow" @click="editShow = false">
            <p>Cancelar</p>
            <img
              src="../assets/icons/block.svg"
              alt="cancel icon"
              style="width: 3.2rem"
            />
          </div>
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
          v-if="ticket.status == 'progress'"
          @click="setFinishedTicket(ticket.id)"
        >
          <p>Finalizar</p>
          <img src="../assets/icons/check.png" alt="check icon" />
        </div>
        <div
          class="action"
          v-if="ticket.status == 'finished'"
          @click="reopen(ticket.id)"
        >
          <p>Abrir novamente</p>
          <img src="../assets/icons/reload.png" alt="reload icon" />
        </div>
        <div
          class="action"
          v-if="ticket.status == 'open'"
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
import { FormatDate } from "@/assets/utils/FormatDate";
import { InitializeVars } from "@/assets/utils/InitializeVars";

const { token, admin, delete_ticket, techName } = InitializeVars();

const ticketFocus = ref(false);
const editShow = ref(false);
const category = ref("");
const description = ref("");

const props = defineProps({
  ticket: {},
});

const emit = defineEmits([
  "deleted",
  "progress",
  "finished",
  "reopen",
  "edited",
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

function showTicketInfos() {
  if (editShow.value) {
    ticketFocus.value = true;
  } else {
    ticketFocus.value = !ticketFocus.value;
  }
}

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
        id: ticket.id,
      }),
    });

    const data = await res.json();

    if (res.status != 200) {
      console.error(data);
    }

    emit("deleted", { id: ticket.id, status: res.status });
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
      techName,
    }),
  });

  const data = await res.json();

  if (res.status != 200) {
    console.error(data);
  }

  emit("progress", { id, status: res.status });
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
      techName,
    }),
  });

  const data = await res.json();

  if (res.status != 200) {
    console.error(data);
  }

  emit("finished", { id, status: res.status });
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

  if (res.status != 200) {
    console.error(data);
  }

  emit("reopen", { id, status: res.status });
}

async function saveEdited(id) {
  const confirmation = confirm(
    `Deseja salvar estas informações?\nDescrição: ${
      description.value
    }\nCategoria: ${Translate(category.value)}`
  );
  if (confirmation) {
    const res = await fetch(baseUrl + "/ticket/edit", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        description: description.value,
        category: category.value,
      }),
    });

    const data = await res.json();

    if (res.status != 200) {
      console.error(data);
    }

    description.value = "";
    category.value = "";

    editShow.value = false;

    emit("edited", { id, status: res.status, data });
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
  gap: 7rem;
}

.ticket-actions .actions {
  display: flex;
  gap: 2.4rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ticket-actions .more-infos {
  white-space: nowrap;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1.5rem;
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

.editActions {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  justify-content: center;
  align-items: center;
}

.more-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.status {
  padding: 0.3rem 0.7rem;
  border-radius: 1.2rem;
}

.priority {
  padding: 0.3rem 0.7rem;
  border-radius: 1.2rem;
}

.checkReccurrent {
  width: 2.5rem;
}

.edit {
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  border: none;
  background: var(--medium-background);
  color: var(--light-color);
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
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

  .more-info {
    justify-content: center;
  }
}
</style>
