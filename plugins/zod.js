import Vue from 'vue'

const zodMixins = {
  install(Vue) {
    Vue.mixin({
      data() {
        // console.log(this.$options)
        if (this.$options.validations) {
          return {
            $error: {},
          }
        }
        return {}
      },
      created() {},
    })
  },
}

Vue.use(zodMixins)
