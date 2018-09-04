<template>
  <div class="assess-container">
    <div class="assess-header">
      <div class="assess-person">
        <span class="assess-depart">{{assessData.department}}</span>
        /
        <span class="assess-name">{{assessData.name}}</span>
      </div>
      <div class="assess-time">
        {{assessData.time}}
      </div>
    </div>
    <div class="assess-content">
      {{assessData.content}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'assessComponent',
  props: {
    assessData: {}
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
      .assess-time{
        float: right;
        font-size: 12px;
        padding-right: 10px;
        color: #8c8c8c;
      }
    }
    .assess-content{
      text-indent: 15px;
      margin-top: 10px;
      word-break: break-all;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 24px;
      color: #282828;
    }
  }

</style>
