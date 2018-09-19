<template>
  <div class="resume-filter">
    <div class="filter-item">
      <div class="filter-title">Degree</div>
      <div class="filter-options">
        <a-checkbox
          v-for="(degree, idx) in ['Doctor', 'Master', 'Bachelor']" :key="idx"
          :checked="isFilteredDegree(degree)"
          @change="handleFilterDegree(degree)"
        >{{degree}}</a-checkbox>
      </div>
    </div>
    <div class="filter-item">
      <div class="filter-title">Expected Salary (per month)</div>
      <div class="filter-options">
        <a-checkbox
          v-for="(salary, idx) in [[0, 3], [3, 8], [8, 15], [15, 30]]" :key="idx"
          :checked="isFilteredSalary(salary)"
          @change="handleFilterSalary(salary)"
        >{{salary[0]}} ~ {{salary[1]}} k</a-checkbox>
        <a-checkbox
          :checked="isFilteredSalary([30, 999])"
          @change="handleFilterSalary([30, 999])"
        >More than 30k</a-checkbox>
        <a-input-group compact style="display: inline-block; width: auto">
          <a-checkbox
            style="padding: 1px 3px 0px 3px; border: 1px solid #dcdcdc;"
            :checked="filter.salary.length === 1 && customSalary[0] === filter.salary[0][0]"
            @change="filter.salary = []"
          />
          <a-input size="small" style="width: 30px; text-align: center" placeholder="8" v-model="customSalary[0]"/>
          <a-input size="small" style="width: 20px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="~" disabled/>
          <a-input size="small" style="width: 30px; text-align: center; border-left: 0" placeholder="20" v-model="customSalary[1]"/>
          <a-button size="small" @click="handleFilterCustomSalary">Confirm</a-button>
        </a-input-group>
        <br />
      </div>
    </div>
    <div class="filter-item">
      <div class="filter-title">Graduated At</div>
      <div class="filter-options">
        <a-checkbox
          :checked="isFilteredGraduation([2019, 2999])"
          @change="handleFilterGraduation([2019, 2999])"
        >After 2019</a-checkbox>
        <a-checkbox
          v-for="(graduation, idx) in [2019, 2018, 2017, 2016]" :key="idx"
          :checked="isFilteredGraduation([graduation, graduation])"
          @change="handleFilterGraduation([graduation, graduation])"
        >
          <span>{{graduation}}</span>
          <a-tag color="blue" v-if="graduation === 2018">Current Year</a-tag>
        </a-checkbox>
        <a-checkbox
          :checked="isFilteredGraduation([1000, 2016])"
          @change="handleFilterGraduation([1000, 2016])"
        >Before 2016</a-checkbox>
      </div>
    </div>
    <div class="filter-item">
      <div class="filter-title">Work Experience</div>
      <div class="filter-options">
        <a-checkbox
          :checked="isFilteredExperience([0, 1])"
          @change="handleFilterExperience([0, 1])"
        >Less than 1 year</a-checkbox>
        <a-checkbox
          v-for="(experience, idx) in [[1, 3], [3, 5], [5, 8]]" :key="idx"
          :checked="isFilteredExperience(experience)"
          @change="handleFilterExperience(experience)"
        >{{experience[0]}} ~ {{experience[1]}} years</a-checkbox>
        <a-checkbox
          :checked="isFilteredExperience([8, 999])"
          @change="handleFilterExperience([8, 999])"
        >More than 8 years</a-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'field-filter',
  data () {
    return {
      filter: {},
      customSalary: [null, null]
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
    clearFilter () {
      this.filter = {
        degree: [],
        salary: [],
        graduation: [],
        experience: []
      }
    },
    // ---- degree
    indexOfFilteredDegree (degree) {
      return this.filter.degree.indexOf(degree)
    },
    isFilteredDegree (degree) {
      return this.indexOfFilteredDegree(degree) !== -1
    },
    handleFilterDegree (degree) {
      const idx = this.indexOfFilteredDegree(degree)
      if (idx === -1) {
        this.filter.degree.push(degree)
      } else {
        this.filter.degree.splice(idx, 1)
      }
    },
    // ---- salary
    indexOfFilteredSalary (salary) {
      return this.filter.salary.findIndex(o => o[0] === salary[0] && o[1] === salary[1])
    },
    isFilteredSalary (salary) {
      return this.indexOfFilteredSalary(salary) !== -1
    },
    handleFilterSalary (salary) {
      this.customSalary = [null, null]
      const idx = this.indexOfFilteredSalary(salary)
      if (idx === -1) {
        this.filter.salary.push(salary)
      } else {
        this.filter.salary.splice(idx, 1)
      }
    },
    handleFilterCustomSalary () {
      this.filter.salary = []
      this.filter.salary.push(this.customSalary)
    },
    // ---- graduation
    indexOfFilteredGraduation (graduation) {
      return this.filter.graduation.findIndex(o => o[0] === graduation[0] && o[1] === graduation[1])
    },
    isFilteredGraduation (graduation) {
      return this.indexOfFilteredGraduation(graduation) !== -1
    },
    handleFilterGraduation (graduation) {
      const idx = this.indexOfFilteredGraduation(graduation)
      if (idx === -1) {
        this.filter.graduation.push(graduation)
      } else {
        this.filter.graduation.splice(idx, 1)
      }
    },
    // ---- experience
    indexOfFilteredExperience (experience) {
      return this.filter.experience.findIndex(o => o[0] === experience[0] && o[1] === experience[1])
    },
    isFilteredExperience (experience) {
      return this.indexOfFilteredExperience(experience) !== -1
    },
    handleFilterExperience (experience) {
      const idx = this.indexOfFilteredExperience(experience)
      if (idx === -1) {
        this.filter.experience.push(experience)
      } else {
        this.filter.experience.splice(idx, 1)
      }
    }
  },
  created () {
    this.clearFilter()
  }
}
</script>

<style scoped lang="less">
  .resume-filter {
    .filter-item {
      .filter-title {
        display: inline-block;
        font-weight: bold;
        text-align: right;
        &:after {
          content: ":";
          padding-right: 16px;
        }
      }
      .filter-options {
        display: inline-block;
      }
    }
  }
</style>
