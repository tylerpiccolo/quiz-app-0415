import React, { useEffect, useState } from 'react';
import axios from 'axios'

// static displayName = Home.name;

export const Quiz = (props) => {
  // axios call here
  useEffect(() => {
    getQuiz();
  }, [])

  const [quiz, setQuiz] = useState([])
  const [quizIsLoaded, setQuizIsLoaded] = useState(false)
  const [quizErr, setQuizErr] = useState(false)

  const getQuiz = () => {

    axios.get(`http://localhost:8080/take-quiz/6062368c4ceba065107d0c10`)
      .then(((response) => {
        setQuiz(response.data);
        setQuizIsLoaded(true);
      }))
      .catch(error => {
        setQuizErr(true)
      })
  }

  if (!quizIsLoaded) {
    return <div className="App">Loading... </div>;
  }


  if (quizErr) {
    return <div>Quiz not found</div>
  }

  return (

        <div>
            

                <div className="container">
                  <div className="upcoming__wrapper">
                    <span>Quiz</span>
                  </div>
                  <div key={quiz._id}><p>{quiz.questions}</p></div>
                </div>

            
          </div>
  


  )
}
// export default Home;