
import _ from 'lodash'

export const uniqueQuestions = (responses) => {
  console.log('responses', responses)
  return _.uniqBy(_.flatMap(responses, 'questions'), 'itemId');
}

/* given a questionId and the number of attempts, 
calculate how many students did not get it correct within numAttempts
**/
export const notCorrectWithinAttempts = (questionId, numAttempts) => {

}
