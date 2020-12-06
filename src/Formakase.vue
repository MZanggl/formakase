<template>
  <form ref="form" novalidate @submit.prevent="onSubmit">
    <slot v-bind="form"/>
  </form>
</template>

<script>
import Vue from "vue";
import { collectErrors } from './validation'
import { formakaseProps, defaultForm } from './constants'
import { makeDraft, disableSubmitButtons, parseInputValue, setDefaultValues } from './form-fields'

export default {
  props: formakaseProps,

  data() {
    return { form: defaultForm(), refs: {} };
  },

  computed: {
    // make copy to detect changes in watcher
    draftCopy() {
      return {...this.form.draft}
    }
  },

  mounted() {
    const elements = this.collectElements()
    setDefaultValues(elements);
    Vue.set(this.form, "draft", makeDraft(elements));

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
    },
    draftCopy: {
      handler(draft, oldDraft) {
        for (const field of Object.keys(draft)) {
          if (draft[field] !== oldDraft[field]) {
            this.$refs.form.elements[field].value = draft[field]
            if (this.live) {
              this.validate([this.$refs.form.elements[field]])
            }
          }
        }
      },
      deep: true,
    }
  },

  methods: {
    collectElements() {
      return [...this.$refs.form.elements].filter(element => element.tagName === "INPUT" && !!element.name);
    },
    async onInput(e) {
      if (!e.target.name) return;

      const value = parseInputValue(e.target);
      Vue.set(this.form.draft, e.target.name, value);

      if (this.form.errors[e.target.name]) {
        Vue.delete(this.form.errors, e.target.name);
      }
    },
    async validate(elements) {
      const errors = await collectErrors(elements, this.$listeners.validate, this.messages)
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