/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'development' | 'production';
      APP_NAME: string;
      PORT: string;
      MONGODB_URI: string;
      ACCESS_TOKEN_SECRET: string;
    }
  }
}

export {};
