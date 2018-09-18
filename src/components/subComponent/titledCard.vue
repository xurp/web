<template>
  <div class="tcard-container">
    <a-card :title="title" v-on:click="toggleCard" :bodyStyle="cardBodyStyle" :headStyle="{height:35,minHeight:0}">
      <div class="card-title-float" v-on:click="toggleCard"></div>
      <div class="content-container" v-bind:hidden="toggleState">
        <slot></slot>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'titled-card',
  data () {
    return {
      toggleState: false,
      cardBodyStyle: {
        padding: 0
      }
    }
  },
  created () {
    this.cardBodyStyle = this.toggleState ? {padding: 0} : {padding: '15px 0 0 0'}
  },
  props: [
    'title'
  ],
  watch: {
    toggleState (newValue, oldValue) {
      this.cardBodyStyle = this.toggleState ? {padding: 0} : {padding: '15px 0 0 0'}
    }
  },
  methods: {
    toggleCard (e) {
      this.toggleState = !this.toggleState
    }
  }
}
</script>

<style scoped lang="less">
  .tcard-container{
    margin-top: 5px;
  }
  .card-title-float{
    width: 100%;
    right: 0;
    top: 0;
    background-color: rgba(1,1,1,0.01);
    /*box-shadow: 1px 1px 2px #226;*/
    border-radius: 5px;
    height: 6vh;
    position: absolute;
  }
</style>
