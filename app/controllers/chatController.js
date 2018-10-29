const mongoose = require('mongoose');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')
const ChatModel = mongoose.model('Chat')

let getChat = (req, res) => {

  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.query.chatRoom)) {
        logger.info('parameters missing', 'getChat handler', 9)
        let apiResponse = response.generate(true, 'parameters missing.', 403, null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of validateParams function.

 
  let findChats = () => {
    return new Promise((resolve, reject) => {

      let findQuery = {
        chatRoom: req.query.chatRoom
      }

      ChatModel.find(findQuery)
        .select('-_id -__v')
        .sort('-createdOn')
        .lean()
        .exec((err, result) => {
          if (err) {
            console.log(err)
            logger.error(err.message, 'Chat Controller: getChat', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            reject(apiResponse)
          } else if (check.isEmpty(result)) {
            logger.info('No Chat Found', 'Chat Controller: getChat')
            let apiResponse = response.generate(true, 'No Chat Found', 404, null)
            reject(apiResponse)
          } else {
            console.log('chat found and listed.')
            result.reverse()
            resolve(result)
          }
        })
    })
  } // end of the findChats function.

  validateParams()
    .then(findChats)
    .then((result) => {
      let apiResponse = response.generate(false, 'All Group Chats Listed', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the getChat function.

module.exports = {
  getChat: getChat
}
