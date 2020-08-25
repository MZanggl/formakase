<template>
  <input
    v-bind="$props"
    :value="draftValue"
    @input="onInput"
    :disabled="$props.type === 'submit' && form.pending"
  >
</template>

<script>
export default {
  name: "PromiseInput",

  props: ["name", "type", "value"],

  inject: ["formakaseBind", "form"],

  computed: {
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