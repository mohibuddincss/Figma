import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Redux
import { Provider } from 'react-redux'
import store from './redux/store/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
// component
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
// supabase
import {supabase} from './config/supabase.js'
import { loginUser , logoutUser } from './redux/reducer/userSlice.js'
import App from './App.jsx'
// import SingleUser from './pages/SingleUser.jsx'
// import Blog from './pages/Blog.jsx'
 import './index.css'

// Restore Session before render
const restoreSession = async ()=>{
  const {data:{session}} = await supabase.auth.getSession()
  if(session){
    const {data : userData} = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()
    
    
    if(userData){
      store.dispatch(loginUser(userData))
    }
  }
  // Listen for auth state change
  supabase.auth.onAuthStateChange(async(event , session)=>{
    
    if(event === 'SIGNED_IN' && session){
      const {data: userData} = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
      if(userData){
        store.dispatch(loginUser(userData))
      }
    }
    if(event === 'SIGNED_OUT'){
      store.dispatch(logoutUser())
    }
  })
}

// Restore session then render app
restoreSession().then(()=>{
  
  createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='app' element={<App/>}/>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* <Route path='blog' element={<Blog />} /> */}
      </Routes>
    </BrowserRouter>
  </Provider>
)
})

// ok now you tell me how to install tailwind and how to use  i forgot and i try again to learn well  in my project then we goto the next steps that you suggest me . you just tell me go to tailwindwebsite this this ... don't give me command to paste it i want to learn where i find it 