import { createStore } from 'vuex'

import app from './modules/app'
import menu from './modules/menu'
import data from './modules/data'
export const store = createStore({
  modules:{
    app,
    menu,
    data,
  }
})

export default store;