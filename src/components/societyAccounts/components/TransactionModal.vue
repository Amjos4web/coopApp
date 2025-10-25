<template>
 <div class="modal-backdrop d-flex align-items-center justify-content-center">
  <div class="modal-content custom-modal">
    <h5 class="mb-2 text-capitalize">{{ type }}</h5>

    <input
      type="number"
      v-model="amount"
      class="form-control"
      placeholder="Enter amount"
    />

    <div class="d-flex mt-2 gap-2 mt-5">
      <button class="btn btn-secondary me-2" @click="$emit('close')">
        Cancel
      </button>
      <button
        class="btn btn-primary"
        :disabled="!amount || isLoading"
        @click="submit"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
        Submit
      </button>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: "TransactionModal",
  props: {
    type: { type: String, required: true }, // deposit, withdraw, borrow, repay
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      amount: null,
    };
  },
  methods: {
    submit() {
      this.$emit("submit", { type: this.type, amount: this.amount });
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px; /* limit width on larger screens */
  margin: 1rem;     /* margin on all sides for mobile */
}

</style>
