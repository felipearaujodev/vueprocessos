import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/processos',
      name: 'processos',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProcessosView.vue')
    },
    {
      path: '/processo-cadastro',
      name: 'processo-cadastro',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/processo/ProcessoForm.vue')
    },
    {
      path: '/processo-detalhes/:id',
      name: 'processo-detalhes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/processo/ProcessoDetalhe.vue'),
      children:[{
        path:'historico',
        name: 'processo-historico', 
        component:()=> import('../components/processo/ProcessoHistorico.vue')
      }]
      
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../components/Erro404.vue') }
  ]
})

export default router
