<template>
  <form @submit.prevent="onSubmit">
    <slot v-bind="form"/>
  </form>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    value: Object,
    normalize: {
      type: Boolean,
      default: true
    }
  },

  data() {
    const form = {
      draft: {},
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
      if (this.normalize) {
        for (const key in this.form.draft) {
          if (typeof this.form.draft[key] === "string") {
            this.form.draft[key] = this.form.draft[key].trim();
          }
        }
      }

      try {
        await this.$listeners.submit(this.form.draft);
      } catch (error) {
        this.form.pending = false;
        throw error
      }
      this.form.pending = false;
    }
  }
};
</script>