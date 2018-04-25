import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Swagger = resolve => require(['@/views/Swagger'], resolve)
const View = resolve => require(['@/views/View'], resolve)
const Edit = resolve => require(['@/views/Edit'], resolve)
const About = resolve => require(['@/views/About'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/swagger',
        component: Swagger
    },
    {
        path: '/view',
        component: View
    },
    {
        path: '/edit',
        component: Edit
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
