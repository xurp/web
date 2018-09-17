<template>
  <div>
    <a-collapse :bordered="false">
      <a-collapse-panel
        v-for="(offer, idx) in offers" :key="idx"
        style="background: #f9f9f9;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden;"
      >
        <div slot="header" style="padding: 0 16px">
          <div style="float: right">{{offer.offerTime}}</div>
          <div style="float: left">
            <span>{{offer.applicationDTO.job.department}}</span>
            <span>/</span>
            <span>{{offer.applicationDTO.job.name}}</span>
          </div>
          <div align="center">{{offer.result}}</div>
          <div style="clear: both"/>
        </div>
        <template v-if="offer.respondTime">
          <a-alert banner showIcon :type="offer.result === 'accept' ? 'success' : 'error'">
            <template slot="message">You have {{offer.result}} the offer</template>
          </a-alert>
        </template>
        <template v-else>
          <a-alert showIcon banner type="info">
            <a slot="message" @click="operateOffer(offer)">Click here to accept/reject offer</a>
          </a-alert>
        </template>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import axios from '../../service'
import moment from 'moment'
export default {
  name: 'offer-list-candidate',
  data () {
    return {
      offers: []
    }
  },
  methods: {
    fetchOffers () {
      axios.get('offer').then(r => {
        this.offers = r.data.map(o => ({
          ...o,
          offerTime: moment(o).format('YYYY-MM-DD HH:mm:ss')
        }))
      })
    },
    operateOffer (offer) {
      window.open(`${window.location.pathname}/#/o/${offer.id}`)
    }
  },
  created () {
    this.fetchOffers()
  }
}
</script>

<style scoped>
</style>
