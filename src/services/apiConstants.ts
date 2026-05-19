import Config from 'react-native-config';
import logger from '../utils/logger';

// Base url
logger.log('Config.BASE_URL:', Config.BASE_URL);

export const apiBaseURL = {
    development: Config.BASE_URL,
    stage: '',
    production: '',
};
