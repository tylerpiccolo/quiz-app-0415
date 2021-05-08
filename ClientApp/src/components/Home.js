import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from "react-router-dom"

// static displayName = Home.name;

export const Home = () => {
  // axios call here
  useEffect(() => {
    getQuizzes();
  }, [])

  const [quizzes, setQuizzes] = useState([])
  const [quizzesIsLoaded, setQuizzesIsLoaded] = useState(false)
  const [quizzesErr, setQuizzesErr] = useState(false)

  const getQuizzes = () => {

    axios.get(`http://localhost:8080/quizzes/`)
      .then(((response) => {
        setQuizzes(response.data.quizzes);
        setQuizzesIsLoaded(true);
      }))
      .catch(error => {
        setQuizzesErr(true)
      })
  }

  if (!quizzesIsLoaded) {
    return <div>Loading...</div>;
  }

  if (quizzesErr) {
    return <div>quizzes not found</div>
  }

  return (
    <div>
      {
        (quizzes.length > 0 ? (
          <div className="container">
            <div className="upcoming__wrapper">
              <span>Quizzes</span>
            </div>
            {quizzes.map((quiz) => (
              <div className="column" key={quiz._id}>
                <article className="article">

                  <Link to={`/take-quiz/${quiz._id}`} style={{ color: "inherit", textDecoration: "none" }} >
                    <h2 className="article__title">{quiz.title}</h2>
                    <p className="article__excerpt">
                      {quiz.description}
                    </p>

                  </Link>
                </article>
              </div>
            ))}
          </div>
        ) : (
          //  make template event?
          'No Quizzes To Show'
        )
        )
      }

    </div>
  )
}

// export default Home;