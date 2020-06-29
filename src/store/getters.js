const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  routers: state => state.permission.routes,
  addRoutes:state => state.permission.addRoutes
}
export default getters
