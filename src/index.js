import FormakaseForm from "./FormakaseForm";
import FormakaseInput from "./FormakaseInput";

const Formakase = {
  install(Vue) {
    Vue.component("FormakaseForm", FormakaseForm);
    Vue.component("FormakaseInput", FormakaseInput);
  }
};

export default Formakase;
