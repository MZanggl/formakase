## Formakase

With there being so many different small details that come with building forms, writing code for it <strike>is</strike> was rather complex and verbose. Formakase takes care of the things we tend to forget.

Features
- Minimal code for minimal needs
- All state handled internally (Think traditional form submissions to a backend where all you need is a "name" attribute)
- Submit buttons automatically get disabled while the form is submitting
- Normalization: Strings get trimmed upon submit
- You have full control over how your form looks like

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

### Submission

Submit buttons automatically get disabled on submit.

You can disable it by explicitely turning it off:

```vue
<template>
  <FormakaseForm>
    <FormakaseInput type="submit" :disableOnSubmit="false"/>
  </FormakaseForm>
</template>
```

Likewise, on any other `FormakaseInput` type, you can turn the setting on using the same prop:

```vue
<template>
  <FormakaseForm>
    <FormakaseInput type="email" disableOnSubmit /> 
  </FormakaseForm>
</template>
```

### Normalization

On submission, all strings will automatically get trimmed and updated in the form. You can disable it like this:

```vue
<template>
  <FormakaseForm :normalize="false">
  </FormakaseForm>
</template>
```

TODO
- add support for select and textarea
- extend HTML5 validation