import "./index.scss";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import React from "react";
import { Input } from "antd";
let msg = ""; // eslint-disable-line no-unused-vars
const CHAT = () => {
  const navigate=useNavigate()//使用useNavigate 进行路由的跳转以及传参，并且获取参数。
  const [question, setQuestion] = useState(""); //问题
  const [answer, setAnswer] = useState(""); //答案
  // const [loading, setLoading] = useState(false);//页面加载业务，setLoading(true)是加载中，初始化false不加载
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("question", question);

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    axios.post("http://43.153.124.222:80/resume/create",formData,{}).then((res)=>{
        if(res.data.message){
            console.log("xs")
            // updates the result object
            setAnswer(res.data.data)
            console.log('res.data.message',res.data.message);
            navigate("/")
        }
    }).catch((err)=>console.error(err))
    // setLoading(true);
  };
  //     window.document.getElementById("rec_msg").textContent = result;
  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="reply">
          <div id="rec_msg">sxsx</div>
        </div>
        <Input onChange={(e) => setQuestion(e.target.value)} />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CHAT;
