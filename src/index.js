import Formakase from "./Formakase";

const FormakasePlugin = {
  install(Vue) {
    Vue.component("Formakase", Formakase);
  }
};

export default FormakasePlugin;
