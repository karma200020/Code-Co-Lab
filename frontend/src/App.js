import './App.css';
import TextEditor from './components/TextEditor'
import {BrowserRouter, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import MyCode from './components/MyCode'
import store from './store'
import PrivateRoute from './components/routing/PrivateRoute'

// import Ide from './components/Ide'
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          {/* <Ide/> */}
          <Route exact path='/' component={login}/>
          <Route exact path='/login' component={login}/>
          <Route exact path='/Register' component={Register}/>
          <Route exact path='/mycode/:id' component={MyCode}/>
          <Route path='/Profile' component={Profile}/>
          <PrivateRoute path='/texteditor' component={TextEditor}/>
          {/* // <TextEditor/>  */}
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
