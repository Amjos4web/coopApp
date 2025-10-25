<template>
  <div class="modal fade" id="addMemberModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <form @submit.prevent="handleSubmit" class="col-12">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              <i class="fa" :class="form.id ? 'fa-edit' : 'fa-plus'"></i>
              {{ modalTitle }}
            </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Error -->
          <div v-if="error" class="text-center error-div">
            <span>{{ error.message }}</span>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img" />
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="row">
              <!-- Full Name -->
              <div class="form-group col-12">
                <label>Full Name</label>
                <input type="text" class="form-control" v-model="form.name" />
                <span class="error" v-if="elementHasError('name')">
                  {{ error.errors.name[0] }}
                </span>
              </div>

              <!-- Email -->
              <div class="form-group col-12">
                <label>Email Address</label>
                <input type="email" class="form-control" v-model="form.email" />
                <span class="error" v-if="elementHasError('email')">
                  {{ error.errors.email[0] }}
                </span>
              </div>

              <!-- Phone -->
              <div class="form-group col-12">
                <label>Phone Number</label>
                <input type="text" class="form-control" v-model="form.phone" />
                <span class="error" v-if="elementHasError('phone')">
                  {{ error.errors.phone[0] }}
                </span>
              </div>

              <!-- Address -->
              <div class="form-group col-12">
                <label>Address</label>
                <textarea class="form-control" v-model="form.address"></textarea>
                <span class="error" v-if="elementHasError('address')">
                  {{ error.errors.address[0] }}
                </span>
              </div>

              <!-- Gender -->
              <div class="form-group col-12">
                <label>Gender</label>
                <select v-model="form.gender" class="form-control">
                  <option value="">Choose your option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <span class="error" v-if="elementHasError('gender')">
                  {{ error.errors.gender[0] }}
                </span>
              </div>

              <!-- Can Pay -->
              <div class="form-group col-12">
                <label>Can Make Payment</label>
                <select v-model="form.can_pay" class="form-control">
                  <option value="">Choose your option</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                <span class="error" v-if="elementHasError('can_pay')">
                  {{ error.errors.can_pay[0] }}
                </span>
              </div>

              <!-- Active Switch -->
              <div class="form-group col-12 d-flex justify-content-between">
                <label>Active</label>
                <label class="switch">
                  <input type="checkbox" v-model="form.active" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer text-center">
            <input type="submit" class="btn btn-primary" :value="form.id ? 'Update' : 'Save'" />
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Validator from "validatorjs";
import { closeModal } from "../../assets/js/helpers/utility";

const initForm = {
  id: null,
  name: '',
  email: '',
  phone: '',
  gender: '',
  can_pay: '',
  address: '',
  active: false
}

export default {
  name: "register-member-modal",
  props: {
    member: {
      type: Object,
      default: () => ({})
    },
    modalTitle: {
      type: String,
      default: "Add Member"
    },
    updateMemberOnParent: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      form: { ...initForm }
    }
  },

  methods: {
    ...mapActions("app/member", ["addNewMember", "updateMember"]),
    ...mapMutations("app/member", ["setError"]),

    handleSubmit() {
      this.setError(null);

      let validation = new Validator(this.form, {
        name: "required|max:100",
        gender: "required",
        can_pay: "required|numeric",
        active: "required"
      });

      if (validation.fails()) {
        const error = new Error(
          "You have error in your data, make necessary change(s) and submit again."
        );
        error.errors = validation.errors.errors;
        this.setError(error);
        return;
      }

      if (this.form.id) {
        // Update member
        this.updateMember({ id: this.form.id, formData: this.form }).then((data) => {
          if (data) {
            this.updateMemberOnParent(data, true, false);
            this.closeSelf();
          }
        });
      } else {
        // Add new member
        this.addNewMember(this.form).then((data) => {
          if (data) {
            this.updateMemberOnParent(data, false, true);
            this.closeSelf();
          }
        });
      }
    },

    elementHasError(elemID) {
      return (
        this.error &&
        this.error.errors &&
        this.error.errors[elemID] &&
        this.error.errors[elemID].length > 0
      );
    },

    closeSelf() {
      closeModal(this.$el);
    },

    resetForm() {
      this.form = { ...initForm }
      this.setError(null)
    }
  },

  computed: {
    ...mapGetters("app/member", ["error", "isLoading"]),
  },

  watch: {
    member: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.id) {
          // Convert active (0/1) → boolean
          this.form = { 
            ...newVal, 
            active: Boolean(Number(newVal.active)) 
          }
        } else {
          this.form = { ...initForm }
        }
      }
    }
  },


  mounted() {
    // Reset when modal closes
    this.$el.addEventListener("hidden.bs.modal", () => {
      this.resetForm()
    })
  },
};
</script>
