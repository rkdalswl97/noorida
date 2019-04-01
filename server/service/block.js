const knex = require('./service.config');

module.exports = {
  isBlocked: async ({ applicant, blockedUser }) => {
    const result = await knex('block')
      .select('applicant', 'blockedUser')
      .where({ applicant, blockedUser })
      .then(results => results)
      .catch(err => err);
    return result.length !== 0;
  },
  block: async ({ applicant, blockedUser }) => {
    const result = await knex('block')
      .insert({ applicant, blockedUser })
      .then(results => results)
      .catch(err => err);
    return result;
  },
  blockList: async ({ applicant }) => {
    const result = await knex('block')
      .select('users.userId', 'users.nickName', 'users.avatar', 'block.blockedUser')
      .where({ applicant })
      .join('users', 'userId', '=', 'block.blockedUser')
      .then(results => results)
      .catch(err => err);
    return result;
  },
  cancelBlock: async ({ applicant, blockedUser }) => {
    const result = await knex('block')
      .where({ applicant, blockedUser })
      .del()
      .then(results => results)
      .catch(err => err);
    return result;
  },
};

