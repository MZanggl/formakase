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
    disableOnSubmit: {
      type: Boolean,
      default: true
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
    Vue.set(this.form, "draft", this.collectFields(true));

    this.$refs.form.addEventListener("input", this.onInput);

    const mutationObserver = new MutationObserver(() => {
      Vue.set(this.form, "draft", this.collectFields());
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
    onInput(event) {
      if (event.target.name) {
        Vue.set(this.form.draft, event.target.name, event.target.value);
      }
    },
    collectElements() {
      return [...this.$refs.form.elements]
        .filter(element => element.tagName === "INPUT")
        .filter(element => element.name);
    },
    collectFields(init) {
      return this.collectElements().reduce((acc, el) => {
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
      if (!this.disableOnSubmit) return;

      [...this.$refs.form.elements]
        .filter(el => ["BUTTON", "INPUT"].includes(el.tagName) && el.type === 'submit')
        .map(el => (el.disabled = value));
    },
    async onSubmit() {
      this.form.pending = true;
      if (this.normalize) {
        for (const key in this.form.draft) {
          if (typeof this.form.draft[key] === "string") {
            this.form.draft[key] = this.form.draft[key].trim();
          }
        }
      }

      this.disableSubmitButtons(true);

      const finalize = () => {
        this.form.pending = false;
        this.disableSubmitButtons(false);
      };

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