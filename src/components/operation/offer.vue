<template>
  <div class="offer-container">
    <div style="font-size: 3em">
      <div style="color: green"><a-icon type="check-circle-o"/></div>
      <div>Congratulations</div>
    </div>
    <div style="margin: 64px 0" v-if="offer">
      <a-card title="Offer" style="font-size: 1.2em">
        <span>{{offer.applicationDTO.job.department}}</span>
        <span>/</span>
        <span>{{offer.applicationDTO.job.name}}</span>
      </a-card>
    </div>
    <div v-if="offer && offer.result" style="font-size: 1.2em">
      <span>You have already</span>
      <a-tag :color="{accept: 'green', reject: 'red'}[offer.result]">{{offer.result}}</a-tag>
      <span>the offer</span>
    </div>
    <div v-else>
      <a-button type="primary" @click="accept" :loading="operating">ACCEPT</a-button>
      <a-button type="danger" @click="rejectConfirmation = ''" :loading="operating">REJECT</a-button>
    </div>
    <a-modal
      title="Confirm your rejection"
      :visible="rejectConfirmation !== null"
      @cancel="rejectConfirmation = null"
    >
      <p>You CANNOT regret this operation!</p>
      <p>Please <a-tag color="blue">I voluntarily give up the offer</a-tag> in the input box</p>
      <a-input v-model="rejectConfirmation"/>
      <template slot="footer">
        <a-button @click="rejectConfirmation = null">Cancel</a-button>
        <a-button
          type="danger"
          :disabled="rejectConfirmation !== 'I voluntarily give up the offer'"
          @click="reject"
          :loading="operating"
        >Reject</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from '../../service'
export default {
  name: 'offer-operation',
  data () {
    return {
      offer: null,
      rejectConfirmation: null,
      operating: false
    }
  },
  methods: {
    fetchOffer () {
      axios.get('offer/' + this.$route.params.offerId).then(r => {
        this.offer = r.data
      })
    },
    accept () {
      this.confirm('accept')
    },
    reject () {
      if (this.rejectConfirmation === 'I voluntarily give up the offer') {
        this.confirm('reject')
      }
    },
    confirm (result) {
      this.operating = true
      axios.put(`offer/${this.$route.params.offerId}?result=${result}`).then(r => {
        this.fetchOffer()
        this.operating = false
        this.rejectConfirmation = null
        this.$message.success(`Offer ${result} succeed!`)
      }).catch(e => {
        this.operating = false
      })
    }
  },
  created () {
    this.fetchOffer()
  }
}
</script>

<style scoped>
  .offer-container {
    width: 80vw;
    margin: 0 auto;
    padding-top: 64px;
    text-align: center;
  }
</style>
