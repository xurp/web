<template>
  <div class="posdetail-container">
    <a-form>
      <a-col :span="8">
        <a-form-item label="Name" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.name"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Department" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.department"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="createTime" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.createTime"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="updateTime" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.updateTime"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Count" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.count"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Remark" :labelCol="labelStyle" :wrapperCol="wrapperStyle">
          <a-input v-bind:disabled="disableEdit" v-model="curPosition.remark"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="Detail" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
          <a-textarea v-bind:disabled="disableEdit" v-model="curPosition.detail" :autosize="{ minRows: 2, maxRows: 6 }"></a-textarea>
      </a-form-item>
      </a-col>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'position-detail',
  data () {
    return {
      wrapperStyle: {
        span: 18
      },
      labelStyle: {
        span: 5
      },
      disableEdit: true
    }
  },
  created () {
  },
  props: {
    curPosition: {}
  }
}
</script>

<style scoped lang="less">

</style>
