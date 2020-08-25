<template>
  <form @submit.prevent="onSubmit">
    <slot v-bind="form"/>
  </form>
</template>

<script>
import Vue from "vue";

export default {
  props: ["value"],

  data() {
    const form = {
      draft: {},
      error: "",
      pending: false
    };
    return { form };
  },

  provide: function() {
    return {
      form: this.form,
      formakaseBind: (key, value) => {
        Vue.set(this.form.draft, key, value);
      }
    };
  },

  watch: {
    form: {
      handler(newForm) {
        // only if user has v-model
        if (this.$listeners.input) {
          this.$emit("input", newForm);
        }
      },
      deep: true
    }
  },

  methods: {
    async onSubmit() {
      this.form.pending = true;
      try {
        await this.$listeners.submit(this.form.draft);
      } catch (error) {
        this.form.error = error;
        // set pending and throw error again?
      }
      this.form.pending = false;
    }
  }
};
</script>