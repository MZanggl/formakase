<template>
  <form ref="form" novalidate @submit.prevent="onSubmit">
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
    },
    autoDisable: {
      type: Boolean,
      default: true
    },
    reportValidity: {
      type: Boolean,
      default: true
    },
    live: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const form = {
      draft: {},
      pending: false,
      errors: {}
    };

    return { form, refs: {} };
  },

  mounted() {
    Vue.set(this.form, "draft", this.makeDraft(this.collectElements(), true));

    this.$refs.form.addEventListener("input", this.onInput);

    const mutationObserver = new MutationObserver(() => {
      Vue.set(this.form, "draft", this.makeDraft(this.collectElements()));
    });

    mutationObserver.observe(this.$refs.form, { childList: true });
  },

  beforeDestroy() {
    this.$refs.form.removeEventListener("input", this.onInput);
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
    async onInput(e) {
      if (!e.target.name) return;
      Vue.set(this.form.draft, e.target.name, e.target.value);
      if (this.live) {
        // TODO: use watch to also catch v-model changes
        await this.validate([e.target])
      } else if (this.form.errors[e.target.name]) {
        Vue.delete(this.form.errors, e.target.name);
      }
    },
    collectElements() {
      return [...this.$refs.form.elements]
        .filter(element => element.tagName === "INPUT")
        .filter(element => element.name);
    },
    async getValidationMessage(el) {
      if (!el.validity.valid && !el.validity.customError) {
        // TODO custom error message
        return el.validationMessage;
      }

      return "";
    },
    makeDraft(elements, init) {
      return elements.reduce((acc, el) => {
        let value = el.value;
        if (init) {
          value = el.getAttribute("data-value");
          el.value = value;
        }

        if (el.type === "number") {
          value = Number(value);
        } else if (el.type === "checkbox") {
          value = el.checked;
        }
        // TODO: date, range

        acc[el.name] = value;
        return acc;
      }, {});
    },
    disableSubmitButtons(value) {
      if (!this.autoDisable) return;

      [...this.$refs.form.elements]
        .filter(el => ["BUTTON", "INPUT"].includes(el.tagName) && el.type === 'submit')
        .map(el => (el.disabled = value));
    },
    async validate(elements) {
      const errors = {};

      const toggleError = (element, message) => {
        if (this.reportValidity) {
          element.setCustomValidity(message);
          element.reportValidity();
        } else if (message) {
          errors[element.name] = message;
        }
      }

      for (const el of elements) {
        const message = await this.getValidationMessage(el);
        toggleError(el, message);
        if (this.reportValidity && message) return false;
      }

      if (this.$listeners.validate) {
        const blame = (name, message) => toggleError(elements.find(el => el.name === name), message);
        await this.$listeners.validate(this.makeDraft(elements), blame);
      }

      Vue.set(this.form, "errors", errors);

      if (Object.keys(errors).length > 0) {
        return false;
      }

      return true;
    },
    async onSubmit() {
      this.form.pending = true;
      
      this.disableSubmitButtons(true);

      const finalize = () => {
        this.form.pending = false;
        this.disableSubmitButtons(false);
      };

      if (this.normalize) {
        for (const key in this.form.draft) {
          if (typeof this.form.draft[key] === "string") {
            this.form.draft[key] = this.form.draft[key].trim();
          }
        }
      }

      if (!await this.validate(this.collectElements())) {
        return finalize();
      }

      try {
        await this.$listeners.submit(this.form.draft);
      } catch (error) {
        finalize();
        throw error;
      }
      finalize();
    }
  }
};
</script>