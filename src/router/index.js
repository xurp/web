import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'

Vue.use(Router)

export const routes = [
  {
    path: '',
    name: 'Dashboard',
    component: () => import('@/components/dashboard/dashboard'),
    show: true
  },
  {
    path: 'audit',
    name: 'HR Audit',
    component: () => import('@/components/review/index'),
    show: ['admin', 'hr']
  },
  {
    path: 'position',
    name: 'Position List',
    component: () => import('@/components/position/index'),
    show: ['hr']
  },
  {
    path: 'position/step/:id',
    name: 'Position Step',
    component: () => import('@/components/position/stepConfig')
  },
  {
    path: 'resume',
    name: 'Resume List',
    component: () => import('@/components/resume/list'),
    show: ['hr']
  },
  {
    path: 'application',
    name: 'Application List',
    component: () => import('@/components/application/applicationList'),
    show: ['hr']
  },
  {
    path: 'application/detail',
    name: 'Application Detail',
    component: () => import('@/components/application/applicationDetail'),
    show: false
  },
  {
    path: 'offer',
    name: 'Offer List',
    component: () => import('@/components/offer/list'),
    show: ['hr']
  },
  {
    path: 'resume/edit',
    name: 'Resume Edit',
    component: () => import('@/components/resume/edit'),
    show: ['candidate']
  },
  {
    path: 'job',
    name: 'Job List',
    component: () => import('@/components/job/list'),
    show: ['candidate']
  },
  {
    path: 'invitation',
    name: 'My Invitations',
    component: () => import('@/components/invitation/list'),
    show: ['candidate']
  },
  {
    path: 'progress',
    name: 'My Progress',
    component: () => import('@/components/progress/list'),
    show: ['candidate']
  },
  {
    path: 'offers',
    name: 'My Offers',
    component: () => import('@/components/offer/list-candidate'),
    show: ['candidate']
  }
]

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/login/login')
    },
    {
      path: '/',
      component: Layout,
      children: routes
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/login/register')
    },
    {
      path: '/black',
      name: 'Black Page',
      component: () => import('@/components/login/blackpage')
    },
    {
      path: '/assess/:id',
      name: 'Assess',
      component: () => import('@/components/operation/assessment')
    },
    {
      path: '/schedule/interview/:operationId/:cooperatorId',
      name: 'Schedule - Interviewer',
      component: () => import('@/components/operation/schedule')
    },
    {
      path: '/schedule/candidate/:operationId/:assessmentId',
      name: 'Schedule - Candidate',
      component: () => import('@/components/operation/schedule')
    },
    {
      path: '/o/:offerId',
      name: 'Offer Operation',
      component: () => import('@/components/operation/offer')
    }
  ]
})
