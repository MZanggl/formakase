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

Use `data-value` over `value`. Specifying "v-bind:value" without "@input" would not make it possible to edit text.
The text inside `data-value` will be placed in the input only upon mounting. Make sure you have all data you need at that point.

```vue
<template>
  <Formakase v-slot="form">
    <input type="text" data-value="default value" />
  </Formakase>
</template>
```

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

### Validation

Formakase embraces HTML5 validation. Most things form libraries validate are already supported natively. I recommend you learning about the various input attributes such as `type`, `minlength`, `min`, `max`, `maxlength`, `required` and `pattern`.

#### Validate live or on submit

By default, inputs will be validated on submit.

```vue
<template>
  <Formakase @submit="onSubmit">
    <input name="username" required />
    <input type="submit"/>
  </Formakase>
</template>
```

Use the `live` prop to validate on every input.

```vue
<template>
  <Formakase live @submit="onSubmit">
    <input name="username" required />
    <input type="submit"/>
  </Formakase>
</template>
```

#### Report validation

By default, validation will be reported using HTML5. You can manage errors yourself by setting `reportValidity` to false.

```vue
<template>
  <Formakase :reportValidity="false" @submit="onSubmit" v-slot="form">
    <input name="username" required />
    {{ form.errors.username }}
    <input type="submit"/>
  </Formakase>
</template>
```

Don't forget that with HTML5 validation you can style invalid fields using the [`:invalid`](https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid) pseudo-class.

#### Custom error messages

> TODO

#### Custom validations

```vue
<template>
  <Formakase @validate="validate">
    <input name="username" />
    <input type="submit"/>
  </Formakase>
</template>

<script>
export default {
  methods: {
    validate(draft, blame) {
      if (draft.username === 'something-bad') {
        blame('username', 'Dont write something bad!')
      }
    }
  }
}
</script>
```