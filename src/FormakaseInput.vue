<template>
  <input
    v-bind="$props"
    :value="draftValue"
    @input="onInput"
    :disabled="isDisabled"
  >
</template>

<script>
export default {
  props: ["name", "type", "value", "disabled", "disableOnSubmit"],

  inject: ["formakaseBind", "form"],

  computed: {
    isDisabled() {
      // parent passing disabled attribute without value or as boolean
      if (this.disabled === "" || this.disabled) {
        return true;
      }

      if (!this.form.pending) {
        return false;
      }

      // parent passing attribute without value or as boolean
      if (this.disableOnSubmit === "" || this.disableOnSubmit) {
        return true;
      }

      // for submit buttons, automatically disable it unless explicitely turned off
      if (this.disableOnSubmit !== false && this.$props.type === "submit") {
        return true;
      }

      return false;
    },
    component() {
      if (this.type === "textarea") {
        return "textarea";
      }
      return "input";
    },
    draftValue() {
      if (!this.name) return this.value;
      return this.form.draft[this.name];
    },
    isBinding() {
      return !["button", "submit"].includes(this.$props.type);
    }
  },

  watch: {
    value: {
      handler(newValue) {
        this.bindForm(this.value);
      },
      immediate: true
    }
  },

  methods: {
    bindForm(value) {
      if (this.isBinding) {
        this.formakaseBind(this.name, value);
      }
    },
    onInput(event) {
      this.bindForm(event.target.value);
    }
  }
};
</script>