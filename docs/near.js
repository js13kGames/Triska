// const { connect, keyStores, WalletConnection } = nearAPI;

// nearAPI = window.nearApi;

// var nearConfig = {
//   contractName: "contract.triska.testnet",
//   networkId: "testnet",
//   keyStore: new window.nearApi.keyStores.BrowserLocalStorageKeyStore(),
//   nodeUrl: "https://rpc.testnet.near.org",
//   walletUrl: "https://wallet.testnet.near.org",
//   helperUrl: "https://helper.testnet.near.org",
//   explorerUrl: "https://explorer.testnet.near.org",
// };

// connect to NEAR
// window.nearApi.connect(config);

// create wallet connection
// var wallet = new window.nearApi.WalletConnection(window.nearApi);

// Initializing contract
async function initContract() {
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

  // Initializing Wallet based Account. It can work with NEAR TestNet wallet that
  // is hosted at https://wallet.nearprotocol.com
  window.walletAccount = new nearAPI.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await window.near.loadContract(nearConfig.contractName, {
    // NOTE: This configuration only needed while NEAR is still in development
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['whoSaidHi'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['sayHi'],
    // Sender is the account ID to initialize transactions.
    sender: window.accountId,
  });
}

async function doWork() {
  // Based on whether you've authorized, checking which flow we should go.
  if (!window.walletAccount.isSignedIn()) {
    signedOutFlow();
  } else {
    signedInFlow();
  }
};

// Function that initializes the signIn button using WalletAccount
function signedOutFlow() {
  // Displaying the signed out flow container.
  Array.from(document.querySelectorAll('.signed-out')).forEach(el => el.style.display = '');
  // Adding an event to a sing-in button.
  document.getElementById('sign-in').addEventListener('click', () => {
    window.walletAccount.requestSignIn(
      // The contract name that would be authorized to be called by the user's account.
      window.nearConfig.contractName,
      // This is the app name. It can be anything.
      'Who was the last person to say "Hi!"?',
      // We can also provide URLs to redirect on success and failure.
      // The current URL is used by default.
    );
  });
}

// Main function for the signed-in flow (already authorized by the wallet).
function signedInFlow() {
  // Displaying the signed in flow container.
  Array.from(document.querySelectorAll('.signed-in')).forEach(el => el.style.display = '');

  // Displaying current account name.
  document.getElementById('account-id').innerText = window.accountId;

  // Adding an event to a say-hi button.
  document.getElementById('say-hi').addEventListener('click', () => {
    // We call say Hi and then update who said Hi last.
    window.contract.sayHi().then(updateWhoSaidHi);
  });

  // Adding an event to a sing-out button.
  document.getElementById('sign-out').addEventListener('click', e => {
    e.preventDefault();
    walletAccount.signOut();
    // Forcing redirect.
    window.location.replace(window.location.origin + window.location.pathname);
  });

  // fetch who last said hi without requiring button click
  // but wait a second so the question is legible
  setTimeout(updateWhoSaidHi, 1000);
}

// Function to update who said hi
function updateWhoSaidHi() {
  // JavaScript tip:
  // This is another example of how to use promises. Since this function is not async,
  // we can't await for `contract.whoSaidHi()`, instead we attaching a callback function
  // usin `.then()`.
  contract.whoSaidHi().then((who) => {
    const el = document.getElementById('who');
    el.innerText = who || 'No one';

    // only link to profile if there's a profile to link to
    if (who) {
      el.href = 'https://explorer.nearprotocol.com/accounts/' + who;
    }

    // change the ? to a !
    const parent = el.parentNode;
    parent.innerHTML = parent.innerHTML.replace('?', '!');
  });
}

// window.nearInitPromise = initContract().then(doWork).catch(console.error);

nearAPI = window.nearApi;

const APP_KEY_PREFIX = 'triska:';
const CONTRACT_NAME = 'contract.triska.testnet';

var nearConfig = {
  contractName: CONTRACT_NAME,
  networkId: "testnet",
  keyStore: new window.nearApi.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

async function init() {
  const near = await nearAPI.connect({
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
      networkId: 'testnet',
      keyStore: new window.nearApi.keyStores.BrowserLocalStorageKeyStore(window.localStorage, APP_KEY_PREFIX)
  });
  const walletConnection = new window.nearApi.WalletConnection(near, APP_KEY_PREFIX)
  let account;
  if (walletConnection.isSignedIn()) {
      // Logged in account, can write as user signed up through wallet
      account = walletConnection.account();
  } else {
      // Contract account, normally only gonna work in read only mode
      account = new nearAPI.Account(near.connection, CONTRACT_NAME);
  } 
}

window.nearInitPromise = init().catch(console.error);