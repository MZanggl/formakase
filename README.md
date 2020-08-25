## Progressive forms

Features
- All state handled internally. (Think traditional form submissions to a backend)
- Submit buttons automatically get disabled while the form is submitting

### Most basic form

```vue
<template>
<FormakaseForm @submit="onSubmit">
  <FormakaseInput name="username" value="initial value" />
  <FormakaseInput type="submit"/>
</FormakaseForm>
</template>

<script>
export default {
  methods: {
    onSubmit(draft) {
      alert(draft) // { username: '<current input value>' }
    }
  }
}
</script>
```

### Form with draft access in template

```vue
<template>
<FormakaseForm @submit="onSubmit" v-slot="form">
  <FormakaseInput name="username" value="initial value" />
  <div>Username: {{ form.draft.username }}</div>
  <FormakaseInput type="submit"/>
</FormakaseForm>
</template>

<script>
export default {
  methods: {
    onSubmit(draft) {
      alert(draft)
    }
  }
}
</script>
```

### Form with draft access everywhere + mutate form state

```vue
<template>
<FormakaseForm @submit="onSubmit" v-model="form">
  <FormakaseInput name="username" value="initial value" />
  <div>Username: {{ form.draft.username }}</div>
  <FormakaseInput type="submit"/>
</FormakaseForm>
</template>

<script>
export default {
  data() {
    return { form: {} }
  },
  methods: {
    onSubmit(draft) {
      alert(draft)
      alert(this.form)
    }
  }
}
</script>
```

TODO
- add "disableOnSubmit" prop to Input
- add validation