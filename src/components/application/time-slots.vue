<template>
  <div>
    <a-select
      mode="tags"
      style="width: 100%"
      :value="slots"
      @change="handleChange"
      placeholder="Time slots per day"
      notFoundContent="Input time period with format like '09:00 ~ 09:45' and press ENTER"
    >
      <a-select-option v-for="slot in slots" :key="slot">{{slot}}</a-select-option>
    </a-select>
    <div>
      <a @click="restoreToDefaultSlots">Use Default</a>
      <a-divider type="vertical"/>
      <a @click="clearAllSlots">Clear All</a>
      <a-divider type="vertical"/>
      <span>Type format-like <a-tag>09:00 ~ 09:45</a-tag></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'time-slots',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      slots: this.value
    }
  },
  watch: {
    slots (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleChange (e) {
      const slots = []
      for (const item of e) {
        const slot = item.trim()
        const result = slot.match(/^(\d{1,2}):(\d{1,2}) *[~-] *(\d{1,2}):(\d{1,2})$/)
        const start = moment(`2018-09-16 ${result[1]}:${result[2]}`)
        const end = moment(`2018-09-16 ${result[3]}:${result[4]}`)
        if (start.isValid() && end.isValid() && start.isBefore(end)) {
          slots.push(`${start.format('HH:mm')} ~ ${end.format('HH:mm')}`)
        } else {
          this.$message.warning(`${slot} is not a valid time period!`)
        }
      }
      this.slots = slots
    },
    restoreToDefaultSlots () {
      const slots = []
      for (const time = moment('2018-09-18 08:00'); time.isBefore(moment('2018-09-18 22:00'));) {
        const start = time.format('HH:mm')
        time.add(45, 'minute')
        const end = time.format('HH:mm')
        time.add(15, 'minute')
        slots.push(`${start} ~ ${end}`)
      }
      this.slots = slots
    },
    clearAllSlots () {
      this.slots = []
    }
  }
}
</script>

<style scoped>

</style>
