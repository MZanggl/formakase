<template>
  <form ref="form" novalidate @submit.prevent="onSubmit">
    <slot v-bind="form"/>
  </form>
</template>

<script>
import Vue from "vue";
import { collectErrors } from './validation'
import { formakaseProps, defaultForm } from './constants'
import { makeDraft, disableSubmitButtons, reportHTML5Message } from './form-fields'

export default {
  props: formakaseProps,

  data() {
    return { form: defaultForm, refs: {} };
  },

  mounted() {
    Vue.set(this.form, "draft", makeDraft(this.collectElements(), true));

    this.$refs.form.addEventListener("input", this.onInput);

    const mutationObserver = new MutationObserver(() => {
      Vue.set(this.form, "draft", makeDraft(this.collectElements()));
    });

    mutationObserver.observe(this.$refs.form, { childList: true });
  },

  beforeDestroy() {
    this.$refs.form.removeEventListener("input", this.onInput);
    // TODO disconnect observer beforeDestroy
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
      return [...this.$refs.form.elements].filter(element => element.tagName === "INPUT" && !!element.name);
    },
    async validate(elements) {
      const errors = await collectErrors(elements, this.$listeners.validate, this.messages, this.reportValidity)

      if (errors.length > 0 && this.reportValidity) {
        const key = Object.keys(errors)[0];
        const element = this.$refs.form.elements[key];
        reportHTML5Message(element, errors[key]);
        return false;
      }

      Vue.set(this.form, "errors", errors);
      return Object.keys(errors).length === 0
    },
    async onSubmit() {
      this.form.pending = true;
      const allFields = [...this.$refs.form.elements]
      this.autoDisable && disableSubmitButtons(allFields, true);

      const finalize = () => {
        this.form.pending = false;
        this.autoDisable && disableSubmitButtons(allFields, false);
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