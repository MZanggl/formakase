export const formakaseProps = {
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
  },
  messages: {
    type: Object,
  }
}

export const defaultForm = () => ({
  draft: {},
  pending: false,
  errors: {}
})