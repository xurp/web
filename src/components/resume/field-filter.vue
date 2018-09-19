<template>
  <div>
    <div v-for="(options, key, idx) in filterOptions" :key="`field-${idx}`">
      <strong style="margin-right: 16px">{{key}}</strong>
      <a-checkbox
        :checked="isChecked(key)"
        @change="handleCheck(key)"
      >All</a-checkbox>
      <a-checkbox
        v-for="(option, idx) in options" :key="`option-${idx}}`"
        :checked="isChecked(key, option)"
        @change="handleCheck(key, option)"
      >{{option}}</a-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'field-filter',
  props: ['filter-options'],
  data () {
    const filter = {}
    Object.keys(this.filterOptions).forEach(o => {
      filter[o] = []
    })
    return {
      filter
    }
  },
  computed: {
    isChecked () {
      return (key, option) => {
        if (option === undefined) {
          return this.filterOptions[key].every(o => this.filter[key].indexOf(o) !== -1)
        } else {
          return this.filter[key].indexOf(option) !== -1
        }
      }
    }
  },
  watch: {
    filter: {
      handler (filter) {
        this.$emit('filter', filter)
      },
      deep: true
    }
  },
  methods: {
    handleCheck (key, option) {
      if (option === undefined) { // All checkbox
        this.filter[key] = this.isChecked(key) ? [] : [...this.filterOptions[key]]
      } else {
        const idx = this.filter[key].indexOf(option)
        if (idx !== -1) {
          this.filter[key].splice(idx, 1)
        } else {
          this.filter[key].push(option)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
