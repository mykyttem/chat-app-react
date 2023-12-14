import React from "react";

import './styles/page404.css';


const Page404 = () => {
  return (
    <>
      <h1>404 Error Page</h1>
      <h2 className="zoom-area"><b>Page</b> not found </h2>
      <section className="error-container">
        <span className="four"><span className="screen-reader-text">4</span></span>
        <span className="zero"><span className="screen-reader-text">0</span></span>
        <span className="four"><span className="screen-reader-text">4</span></span>
      </section>

       <a href="/" class="back-to-home">Back to Home</a>
    </>
  )
};


export default Page404;