var Sequelize = require('sequelize');

var connection = new Sequelize('test', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    insecureAuth: true
});

connection
  .authenticate()
  .then(() => {
            console.log('Connection has been established successfully.');
            var Article = connection.define('article', {
                title: Sequelize.STRING,
                body: Sequelize.TEXT
            });
            
            connection.sync().then(function(){
                Article.create({
                    title: 'demo title',
                    body: 'just a castaway, an island lost at sea, another lonely day with no one here but me oh, more loneliness than any man could bear rescue me before I fall into despair'
                });
            });
        })
  .catch(err => {
            console.error('Unable to connect to the database:', err);
  });


