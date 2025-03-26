declare const config: {
  development: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "mysql";
  };
  test: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "mysql";
  };
  production: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "mysql";
  };
};

export default config;
