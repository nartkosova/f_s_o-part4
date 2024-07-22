const app = require('./app') 
const config = require('./utils/config')
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})