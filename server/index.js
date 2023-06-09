const express = require("express");//引入express板块

const cors = require("cors");//引入cors板块解决跨域
const multer = require("multer");//用于处理表单数据，主要用于上传文件
const path = require("path");//用来处理路径的模块
const { Configuration, OpenAIApi } = require("openai");
let messageArr=[];
const configuration = new Configuration({
  apiKey: "api_key",
});

const mysql = require("mysql"); //引入mysql 模块
// 创建数据库连接 填入数据库信息
const conn = mysql.createConnection({
  user: "chathub", //用户名
  password: "1234", //密码
  host: "43.143.111.217", //主机（默认都是local host）
  database: "chathub", //数据库名
});
module.exports=conn;



const openai = new OpenAIApi(configuration);

const GPTFunction = async (text) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    max_tokens: 2048,//最多返回数
    top_p: 1,//随机情况
    frequency_penalty: 1,//减少模型重复
    presence_penalty: 1,//模型讨论新主题的可能性
  });
  return response.data.choices[0].text;
};

const GPTFunction2 = async (textArr) => {
  const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: textArr,
});
    const result=completion.data.choices[0].message.content
    return result;
};

let database=[]
let id=1

const PORT = 4000;
const app = new express();//创建实例

app.use(express.urlencoded({ extended: true })); //加载解析urlencoded请求体的中间件。
app.use(express.json());//加载解析json的中间件
app.use(cors());//cors板块解决跨域
app.use("/uploads", express.static("uploads"));
app.use(express.static(__dirname+"/build"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

app.get("/", function (req, res) {
    
  res.json({
    message: "Hello World",
  });
});
//查询访问密码数据库里有没有
app.post("/affirm", upload.single("headshotImage"), async (req, res) => {
   
   const {
     secret,//问题
   } = req.body;
    let flag="false"
    const sqlStr='select * from message where replyMsg=?'
     conn.query(sqlStr,secret,(err,result)=>{
            if(err)return console.log(err);
            if(result[0]){
                res.json({
                message: "Request successful!",
                flag:"true"
                });
            }else{
                res.json({
                message: "Request successful!",
                flag:"false"
                });
            }
      })
  
});

app.post("/resume/chat", upload.single("headshotImage"), async (req, res) => {
   
   const {
     question,//问题
   } = req.body;
//   console.log(question);
    messageArr.push({"role": "user", "content":question})
    const answer=await GPTFunction2(messageArr);
    // answer = answer.replace("\n","");
    messageArr.push({"role": "assistant", "content":answer})
    console.log(answer)
   
  
//   console.log(data)
  res.json({
    message: "Request successful!",
    answer
  });
});

app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
  const {
    fullName,//名字
    currentPosition,//职位
    currentLength,//时间
    currentTechnologies,//技术
    workHistory,//公司信息
  } = req.body;
  const workArray = JSON.parse(workHistory); // 将字符串信息变成数组信息

  // 循环遍历 workArray 中的项并将它们转换为字符串
  const remainderText = () => {
    let stringText = "";
    for (let i = 0; i < workArray.length; i++) {
      stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
    }
    return stringText;
  };

  // 工作信息描述
  const prompt1=`我正在写一份简历, 我的信息有 \n 名字: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我具有这些技术: ${currentTechnologies}. 可以用第一人称在简历的最上面帮我写100字的描述吗?`;
  // 关于擅长什么技能
  const prompt2=`我正在写一份简历, 我的信息有 \n 名字: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我具有这些技术: ${currentTechnologies}. 你可以为我的简历写10点关于我擅长什么吗?`;
  // 关于在各个公司的成就
  const prompt3=`我正在写一份简历, 我的信息有 \n 名字: ${fullName} \n 职位: ${currentPosition} (${currentLength} 年). \n 我曾经在这 ${workArray.length} 个公司工作. ${remainderText()} \n 你可以用第一人称为我在这几个公司的贡献分别写50个字吗?`;

  // 得到GPT3的结果
  const objective=await GPTFunction(prompt1);
  const keypoints=await GPTFunction(prompt2);
  const jobResponsibilities = await GPTFunction(prompt3);
  // 放到对象里
  const chatgptData={objective,keypoints,jobResponsibilities};
  console.log('result',chatgptData)

  // 将值分配到一个对象里
  const newEntry = {
    id: id++,
    fullName,
    image_url: `http://43.153.124.222:4000/uploads/${req.file.filename}`,
    currentPosition,
    currentLength,
    currentTechnologies,
    workHistory: workArray,
  };

  const data={...newEntry,...chatgptData};
  database.push(data);

  res.json({
    message: "Request successful!",
    data
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
