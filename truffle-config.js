const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: { // truffle
      port: 8545
    },
    ganache: { // Ganache
      host: "localhost",
      port: 7545,
      network_id: "5777"
    }
  },
  compilers : {
    solc : {
      version : '0.6.1'
    }
  }
};