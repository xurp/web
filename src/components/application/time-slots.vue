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
      <a @click="openGenerator">Generate</a>
      <a-divider type="vertical"/>
      <a @click="clearAllSlots">Clear All</a>
      <a-divider type="vertical"/>
      <span>Type format-like <a-tag>09:00 ~ 09:45</a-tag></span>
    </div>
    <a-modal
      title="Time Periods Generator"
      :visible="generator.visible"
      okText="Generate"
      @ok="generate"
      @cancel="closeGenerator"
    >
      <div style="margin-bottom: 16px">
        <span>From</span>
        <a-time-picker format="HH:mm" v-model="generator.from"/>
        <span>To</span>
        <a-time-picker format="HH:mm" v-model="generator.to"/>
      </div>
      <div style="margin-bottom: 16px">
        <span>Estimate</span>
        <a-input-number v-model="generator.duration"/>
        <span>minutes for each interview</span>
      </div>
      <div style="margin-bottom: 16px">
        <span>Interval</span>
        <a-input-number v-model="generator.gap"/>
        <span>minutes after each interview</span>
      </div>
      <div style="margin-bottom: 16px">
        <a-checkbox v-model="generator.clear">Clear All</a-checkbox>
      </div>
    </a-modal>
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
      slots: this.value,
      generator: {}
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
          slots.push({start, end})
        } else {
          this.$message.warning(`${slot} is not a valid time period!`)
        }
      }
      slots.sort((a, b) => {
        if (a.start.isBefore(b.start)) {
          return -1
        } else if (a.start.isAfter(b.start)) {
          return 1
        } else {
          return 0
        }
      })
      this.slots = slots.map(o => `${o.start.format('HH:mm')} ~ ${o.end.format('HH:mm')}`)
    },
    openGenerator () {
      this.generator = {
        visible: true,
        from: moment('2018-09-19 08:00'),
        to: moment('2018-09-19 22:00'),
        duration: 45,
        gap: 15,
        clear: true
      }
    },
    closeGenerator () {
      this.generator.visible = false
    },
    generate () {
      const slots = this.generator.clear ? [] : [...this.slots]
      for (const time = this.generator.from; time.isBefore(this.generator.to);) {
        const start = time.format('HH:mm')
        time.add(this.generator.duration, 'minute')
        const end = time.format('HH:mm')
        time.add(this.generator.gap, 'minute')
        slots.push(`${start} ~ ${end}`)
      }
      this.slots = slots
      this.closeGenerator()
    },
    clearAllSlots () {
      this.slots = []
    }
  }
}
</script>

<style scoped>

</style>
