const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_api_codelab', 'root', 'root')

const members = sequelize.define('user', {
  name: Sequelize.STRING
});

module.exports = {
  sequelize: sequelize,
  member: member
}