import "./index.scss";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import React from "react";
import { Input, message,Spin } from "antd";
import { useRef, useEffect } from "react";
let msg = ""; // eslint-disable-line no-unused-vars
const CHAT = () => {
  // function the replace the new line with a break tag
  const replaceWithBr = (string) => {
    return string.replace(/\n/g, "<br />"); //把\n 转换成 <br/>
  };
  const navigate = useNavigate(); //使用useNavigate 进行路由的跳转以及传参，并且获取参数。
  const [question, setQuestion] = useState(""); //问题
  const [answer, setAnswer] = useState(""); //答案
  const [secret, setSecret] = useState(""); //输入的答案
  const [flag, setFlag] = useState("false"); //默认不可以使用网站
  const [chatArr, setchatArr] = useState([{ question: "", answer: "" }]); //公司信息
  const [loading, setLoading] = useState(false);//页面加载业务，setLoading(true)是加载中，初始化false不加载
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(flag)
    if(flag==="true"){
      const formData = new FormData();
    formData.append("question", question);

    // for (var key of formData.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    axios.post("http://43.153.124.222:4000/resume/chat", formData, {}).then((res) => {
        if (res.data.message) {
          console.log(res.data.answer);
          // 赋值
          setAnswer(res.data.answer);
          console.log(answer);
          setchatArr([...chatArr, { question: question, answer: res.data.answer }]);
          console.log("res.data.message", res.data.message);
          setLoading(false)
        }
      })
      .catch((err) => console.error(err));
    }else{
      message.info("您需要输入正确的访问密码")
    }
    
    
  };
  const tiaozhuan = () => {
    if(flag==="true"){
      navigate("/home");
    }else{
      message.info("您需要输入正确的访问密码")
    }
    
  };
  const affirm = (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("secret", secret);
    axios.post("http://43.153.124.222:4000/affirm", formData, {})
      .then((res) => {
        if (res.data.message) {
          setLoading(false)
          console.log(res.data.flag);
          // 赋值
          setFlag(res.data.flag);
          if(res.data.flag==="false"){
            message.info("密码错误")
          }else{
            message.info("密码正确，请开始你的ChatGPT之旅")
          }
          console.log("res.data.message", res.data.message);
        }
      })

      .catch((err) => console.error(err));
  };
  //     window.document.getElementById("rec_msg").textContent = result;
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <Spin spinning={loading} tip="加载中......" size="large">
    <div className="App">
      <form method="POST" onSubmit={handleSubmit} className="formClass">
        <div className="home-container">
          <div className="home-left">
            <div className="left-title">
              <div>Chat</div>
              <div>GPT</div>
            </div>
            <div className="left-center">
              <div>
                需要访问密码请关注微信公众号<br></br>red beautiful people
              </div>
              <div>输入您的访问密码</div>
              <Input
                onChange={(e) => setSecret(e.target.value)}
                className="inputClass"
              />
              <div onClick={affirm} className="affirmBtn">
                确认
              </div>
            </div>
            <div className="left-bottom">
              <div>
                你还可以点击这里<br></br>让ChatGPT帮你迅速生成简历
              </div>
              <div onClick={tiaozhuan} className="resumeBtn">
                生成简历
              </div>
            </div>
          </div>
          <div className="home-right">
            <div className="right">
              <div className="r-title">与ChatGPT的对话</div>

              <div className="reply">
              {chatArr.map((item,index)=>(
                  <div key={index}>
                  <div className="reply-right">
                    <div className="right">
                      <p className="pClass">{item.question}</p>
                    </div>
                  </div>
                  <div className="reply-left">
                    <div className="right">
                      <p className="pClass" dangerouslySetInnerHTML={{ __html: replaceWithBr(item.answer) }}></p>
                    </div>
                  </div>
                </div>
              ))}
                
                <div
                  style={{ clear: "both", height: "1px", width: "100%" }}
                  ref={messagesEnd}
                ></div>
              </div>
              <div className="foot">
                <div className="foot-pannel">
                  <Input
                    placeholder="请输入问题"
                    onChange={(e) => setQuestion(e.target.value)}
                    className="footInput"
                  />
                  <button className="footBtn">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </Spin>
  );
};

export default CHAT;
