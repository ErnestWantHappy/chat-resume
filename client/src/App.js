import { useState } from 'react';//useState是 react 提供的一个定义响应式变量的 hook 函数
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Resume from './components/Resume';
import './App.css';

function App() {
  // state holding the result 初始化
  const [result,setResult]=useState({})
  return (
    <div> 
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home setResult={setResult}/>}></Route>
            <Route path='/resume' element={<Resume result={result}/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
