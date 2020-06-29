import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration




router.beforeEach(async (to, from, next) => {
  let t = localStorage.getItem('Cn') || localStorage.getItem('Sn') || null
  // start progress bar
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  if (t) {
    if (to.path === '/login') {
      NProgress.done()
      return next('/')
    } 
  } 


  if (to.path !== '/login') {
    document.title = getPageTitle(to.meta.title)
    if (!t) {
      NProgress.done()
      return next('/login')
    }

    NProgress.done()
    next()
  }
  // set page title
  document.title = getPageTitle(to.meta.title)
  NProgress.done()

  next()

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
