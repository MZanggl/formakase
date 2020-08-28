## Formakase

With there being so many different small details that come with building forms, writing code for it <strike>is</strike> was rather complex and verbose. Formakase takes care of the things we tend to forget.

Features
- Minimal code for minimal needs
- All state handled internally (Think traditional form submissions to a backend where all you need is a "name" attribute)
- Submit buttons automatically get disabled on form submit
- Normalization: Strings get trimmed upon submit
- You have full control over how your form looks like

### Most basic form

```vue
<template>
  <Formakase @submit="onSubmit">
    <input name="username" />
    <input type="submit"/>
  </Formakase>
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
  <Formakase @submit="onSubmit" v-slot="form">
    <input name="username" />
    <div>Username: {{ form.draft.username }}</div>
    <input type="submit"/>
  </Formakase>
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
  <Formakase @submit="onSubmit" v-model="form">
    <input name="username" />
    <div>Username: {{ form.draft.username }}</div>
    <input type="submit"/>
  </Formakase>
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

### Specifying default values

Use `data-value` over `value`.

### Disabling on submit

Formakase automatically disables submit buttons while the submission is pending.
If you want to handle it yourself, you can set `autoDisable` to false and check `form.pending`:

```vue
<template>
  <Formakase v-slot="form" :autoDisable="false">
    <input type="submit" :disabled="form.pending"/>
  </Formakase>
</template>
```

> To disable all inputs, wrap them in `<fieldset :disabled="form.pending">`

### Normalization

On submission, all strings will automatically get trimmed and updated in the form. You can disable it like this:

```vue
<template>
  <Formakase :normalize="false">
  </Formakase>
</template>
```

### Validation (TODO)

Formakase embraces HTML5 validation. Most things form libraries validate are already supported natively. I recommend you learning about the various input attributes such as `type`, `minlength`, `min`, `max`, `maxlength`, `required` and `pattern`.

Formakase extends on the idea with
- custom validations
- running validations either live, or only on submit
- reporting errors using HTML5 or letting you handle them yourself

<details>
  <summary>A quick rundown on HTML5 validation</summary>
    1. On form submission, all inputs are validated
    2. If a field fails validation, it will receive focus, the elements' [`:invalid`](https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid) styling and the error displayed.
</details>
