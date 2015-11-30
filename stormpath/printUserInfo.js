module.exports = function printUserInfo(account) {
  account.getAccount(function (err, account) {
    console.log(account.fullName, 'is authorized and belong to the following groups');
    account.getGroups(function (err, groups) {
      groups.each(function (group) {
        console.log('-', group.name);
      });
    });
    account.getCustomData(function (err, customData) {
      console.log(account.givenName, ' has the role', customData.role);
    });
  });
};
