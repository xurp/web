<template>
  <div class="assess-container">
    <template v-for="assessData in assesses">
      <div :key="assessData.step + Math.random()">
        <div class="assess-header" style="position:relative">
          <div class="assess-person">
            <span class="assess-depart">{{assessData.department}}</span>
            /
            <span class="assess-name">{{assessData.name}}</span>
          </div>
          <div class="assess-result">
            <div class="assess-stepname">{{getStepName(assessData)}}</div>
            <div class="assess-pass"><a-tag v-bind:color="getTagColor(assessData)">{{assessData.pass}}</a-tag></div>
          </div>
          <div class="assess-time">
            {{assessData.time}}
          </div>
        </div>
        <div :key="assessData.step + Math.random()" class="assess-content">
          {{assessData.content}}
        </div>
        <a-divider/>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'assessComponent',
  data () {
    return {
    }
  },
  props: {
    assesses: {
      type: Array
    },
    steps: {
      type: Array
    }
  },
  created () {
    // const curStep = this.steps.find(tr => tr.index === parseFloat(this.assessData.step))
    // this.stepName = curStep === undefined ? '' : curStep.name
  },
  methods: {
    getTagColor (assessData) {
      const mp = {
        assessing: 'pink',
        fail: 'red',
        pass: 'green'
      }
      return mp[assessData.pass]
    },
    getStepName (assessData) {
      const curStep = this.steps.find(tr => tr.index === parseFloat(assessData.step))
      return curStep === undefined ? '' : curStep.name
    }
  }
}
</script>

<style scoped lang="less">
  .assess-container{
    width: 100%;
    padding: 10px 5px;
    margin: 0;

    .assess-header{
      height: 25px;
      line-height: 25px;

      .assess-person{
        float: left;
        .assess-depart{}
        .assess-name{
          font-size: 14px;
          font-weight: bold;
        }
      }

      .assess-result{
        position: absolute;
        left: 0;
        right: 0;
        width: 35%;
        margin: auto;
        height: 35px;
        text-align:center;

        .assess-stepname{
          font-size: 18px;
          font-family: 微软雅黑;
          font-weight: bold;
          float: left;
        }
      }

      .assess-time{
        float: right;
        font-size: 12px;
        color: #8c8c8c;
      }
    }
    .assess-content{
      text-indent: 15px;
      margin-top: 10px;
      word-break: break-all;
      word-wrap: break-word;
      /*font-size: 14px;*/
      line-height: 24px;
      /*color: #282828;*/

      font-family: 微软雅黑;
      color: #777777;
      font-size: 15px;
      letter-spacing: 1.5px;
      word-spacing: 3px;
      line-break: loose;
    }
  }

</style>
