import { useRef } from "react";
import ErrorPage from "./ErrorPage";

const Resume = ({ result }) => {
  const componentRef = useRef();// useRef()可以用来绑定元素节点和保存变量
  // function the replace the new line with a break tag
  const replaceWithBr = (string) => {
    return string.replace(/\n/g, "<br/>");//把\n 转换成 <br/>
  };

  // returns an error page if the result object is empty
  if (JSON.stringify(result) === "{}") {
    return <ErrorPage />;
  }

  const handlePrint = () => alert("Print Successful!");
  return (
    <>
      <button onClick={handlePrint}>打印页面</button>
      <main className="container" ref={componentRef}>
        <header className="header">
          <div>
            <h1>{result.fullName}</h1>
            <br></br>
            <p className="resumeTitle headerTitle">
                {result.currentPosition} ({result.currentTechnologies})
            </p>
            <p className="resumeTitle">
                  {result.currentLength}年工作经验
            </p>
          </div>
          <div>
            <img src={result.image_url} alt={result.fullName} className='resumeImage' />
          </div>
        </header>
        <div className='resumeBody'>
            <div>
                <h2 className='resumeBodyTItle'>简介</h2>
                <p dangerouslySetInnerHTML={{__html:replaceWithBr(result.objective)}} className='resumeBodyContent' />
            </div>
            <div>
                <h2 className='resumeBodyTitle'>工作经历</h2>
                <br></br>
                {result.workHistory.map((work)=>(
                    <p className='resumeBodyContent-mini' key={work.name}>
                      <span style={{fontWeight:"bold"}}>{work.name}</span> - {work.position}
                    </p>
                ))}
            </div>
            <div>
                <h2 className='resumeBodyTitle'>工作简介</h2>
                <p dangerouslySetInnerHTML={{__html:replaceWithBr(result.jobResponsibilities)}}  className="resumeBodyContent" />
            </div>
            <div>
              <h2 className='resumeBodyTitle'>工作技能</h2>
              <p dangerouslySetInnerHTML={{__html:replaceWithBr(result.keypoints)}} className='resumeBodyContent' />
            </div>
        </div>
      </main>
    </>
  );
};

export default Resume;
