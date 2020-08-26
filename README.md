## Formakase

With there being so many different small details that come with building forms, writing code for it <strike>is</strike> was rather complex and verbose. Formakase takes care of the things we tend to forget.

Features
- Minimal code for minimal needs
- All state handled internally (Think traditional form submissions to a backend where all you need is a "name" attribute)
- Submit buttons automatically get disabled while the form is submitting
- Normalization: Strings get trimmed upon submit

### Most basic form

```vue
<template>
<FormakaseForm @submit="onSubmit">
  <FormakaseInput name="username" value="initial value   " />
  <FormakaseInput type="submit"/>
</FormakaseForm>
</template>

<script>
export default {
  methods: {
    onSubmit(draft) {
      alert(draft) // { username: '<current input value trimmed>' }
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
      console.log(draft, this.form)
    }
  }
}
</script>
```

TODO
- add "disableOnSubmit" prop to Input
- add support for select and textarea
- add validation