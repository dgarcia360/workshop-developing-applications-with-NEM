# Developing applications using NEM blockchain

Discover common concerns while developing applications using blockchain technology, and how NEM approaches them. After installing NEM development tools, we will develop a real use case in a hands-on session.

**Requirements:** Basic programming knowledge and bring your own computer.

NEM workshop facilitator will be David Garcia, NEM Technical Trainer for NEM Europe.

* [Download the slides](https://github.com/dgarcia360/workshop-developing-applications-with-NEM/blob/master/slides.pdf)

## Install NanoWallet

Nanowallet conveniently allows you to perform the most commonly used commands from your terminal, i.e. using it to interact with the blockchain, setting up an account and sending funds, etc.

[Download Nanowallet](https://nem.io/downloads/) latest version for your operative system.

Create an account with the command line tool.

## Create an account
An account is a key pair (private and public key) associated to a mutable state stored on the NEM blockchain. Simply put, you have a deposit box on the blockchain, which only you can modify with your key pair. As the name suggests, the private key has to be kept secret at all times. Anyone with access to the private key ultimately has control over the account.

The public key is cryptographically derived from the private key. It would take millions of years to do the reverse process and therefore, the public key is safe to be shared.

Finally, the account address is generated with the public key, following the NEM Blockchain protocol. It is better to share this address than just the public key, as it contains more information, such as a validity check and which network it uses (public, private or testnet).

From the NanoWallet starting interface, select "SIGN UP."

1. Make sure the Simple Wallet tab is selected.
2. Enter a wallet name. Example: YourCompanyName
3. Choose a network. Use Testnet, for software testing purposes.
4. Enter a password to encrypt your account in a wallet, a portable file. Example: correcthorsebatterystaple
5. Press "Create simple wallet" button.

Once you create your simple wallet, login with the provided password and copy the address in a text file. It will be useful to have it somewhere where you can copy and paste it easier to follow the workshop.

### What is XEM and how to get it?
The underlying cryptocurrency of the NEM network is called XEM. Every action on the NEM blockchain costs XEM, to provide an incentive for those who validate and secure the network.

Once you have created an account, ask David for some XEM. Open the Nanowallet account, then click "Account" and press "Share account info QR". David will go table by table scanning the QR and sending TEST XEM to your account.

XEM will appear in your account’s balance after the network confirms the transaction.

## Creating a new project and installing NEM-Library

:warning: Follow this step if you have programming skills. If not, you can jump to next step.

By that time, you should have created an account and have received some XEM. Then it is time to create a folder for your project.


Create a new folder named `workshop. 

    $> mkdir chainges2018

Inside, initialise a package.json file. The minimum required Node.js version is 8.9.X.

    $> npm init

Then, install nem-library and reactivex library.

    $> npm install nem-library rxjs --save

:warning: nem2-sdk is built with TypeScript language.

It is recommended to use TypeScript instead of JavaScript when building applications for NEM blockchain.

    $> npm install -g typescript

Make sure you have at least version 2.5.X installed.

Use ts-node to execute TypeScript files with node.

    $> npm install -g ts-node


## Use case: Supply Chain

We want to track in the blockchain all that happens with a watch, since manufacturing until it reaches the customer.

The whole process counts with the following participants, with different needs:

* Manufacturer: Assure the quality of the manufacturing process.
 
* Distributor: Track where is the product before landing in the shop.

* Shop: Sell the product.

* Customer: Prove the ownership of the product, and demonstrate it is original.

* Manufacturer: Check that the product guarantee it is correct.

We could define this whole process in NEM blockchain, but it will take us a little bit longer. To make it easier at the beginning, we will reduce the scope.

* Company: Assure the authenticity of the product and receive money for my products.

* Customer: To own an authentic product.

### Setup
 
#### Creating two new accounts

Create two new accounts. One for the watch, and another will represent the customer. 

Did you notice that we are using accounts for something different than a person? An account could be either a part of a system, a sensor or even products.

Copy the address in the already opened text file for copying it and paste it easier. The account you have created earlier represents the company.

#### Send XEM to created accounts

![](/images/sending-50-xem.png)

Send 50 XEM to each account to ensure they have enough funds to pay future transactions fees.

To send, all that's required is to enter the recipient's address and the amount you want to send. Then enter your password and hit Send. Listen for the "ding" that confirms it.

Transactions usually require a small fee. The NanoWallet shows the fee and automatically adds it to the transaction. There is a small additional fee for sending a message with your transaction.

#### Creating company:authenticity

 
NEM’s mosaics are let you create and manage tokens on the NEM blockchain. These tokens can then be transferred by issuing transactions just as with NEM’s native tokens, XEMs.

A Mosaic is always created in a namespace`. A namespace is analogue to a domain name you register on the internet. 

Before we create a mosaic to represent the authenticity, we need to create a namespace. For this example, we create a root-namespace representing the `company`.

:warning: Note that namespaces name must be unique. As `company` is probably already chosen, think to put the name of your company or some unique string.


Go to Services and choose "Create namespace".

![](/images/creating-namespace.png)

* Parent Namespace: select ". (New root Namespace)"
* Namespace: company (this is the name of the namespace)
* Password: Your wallet-password

Once you have entered the values, click "Register". Go to the Dashboard and check, if the registration was successful:

After the creation of the Namespaces, we move on to create a mosaic representing authenticity.

Go to Services and choose "Create mosaic".

![](/images/creating-a-mosaic.png)

**Mosaic definition**

* Parent Namespace: select "company"
* Mosaic name: field (this is the name of the mosaic)
* Description (optional): a short text description
* Password: Your wallet-password

**Mosaic properties**

* Initial supply: 100 (100 company:authenticity)
* Divisibility: 0 (authenticity is not divisible)
* Transferable: Means, the mosaic is transferable
* Mutable supply: Means, the quantity can be changed up or down in the future

Once you have entered all the values, click "Send". Go to the Dashboard and check, if the creation was successful.

### Company manufactures the product  

#### Convert watch account to multisig

When an account is created, it is unisig, meaning that it is fully independent, and controls its funds independently from other accounts. A multisig account, on the other hand, does not have control over its funds and assets. Only the cosignatories of the multisig can initiate transactions for the account.

A multisig account is labelled as n-of-m, meaning to m cosignatories have been added, and that at least the quorum of n of them have to accept a transaction for it to be included in the blockchain.

Cosignatories can be added (one or multiple at a time), removed (one at a time) and the quorum of cosignatories can be modified.

Login with the watch account. Click Services in the top panel and after that click **Convert an account to multisig**.

The next step is to convert the MSA account into a multi-signature account. First, you need to put in the private key of the MSA account. Then you can add signers, I will add the addresses of the `company` account. I will also set the Min. signatures to 1. Start the contract conversion by pressing Send, creating a 1-of-1 multisig transaction.

![](/images/creating-multisig.png)

 We have now created a multi-signature account with one signer.

#### Send company:authenticity to watch the account

Assume we have finished quality assurance process. It is time to send the quality stamp to the product.

For doing so, we will send 1 company: authenticity token to watch account.


Do it as you would send XEM, but this time mark "mosaic transfer", selecting the mosaic you want to transfer.

![](/images/sending-authenticity-mosaic.png)


### Customer owns the product

#### Paying for the product

Login with the customer account. Assume that the customer goes to the store and pays for the watch.

:warning: Follow this steps if you have programming skills if not just send with NanoWallet 5 nem:xem to company's address.

In the file you have created, import NEM Library. Then, create a transfer transaction making the recipient the company's address.

```typescript
import {
    NEMLibrary, NetworkTypes, Address, TransferTransaction, Transaction, TimeWindow,
    EmptyMessage, PublicAccount, TransactionHttp, XEM
} from "nem-library";

// Initialize NEMLibrary for TEST_NET Network
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

// Replace address with company's address

const transferTransaction: Transaction = TransferTransaction.create(
    TimeWindow.createWithDeadline(),
    new Address("TCFFOM-Q2SBX7-7E2FZC-3VX43Z-TRV4ZN-TXTCGW-BM5J"),
    new XEM(50),
    EmptyMessage
);
```

Although the transaction is created, it has not been announced to the network yet.

To announce it, the customer shall sign the transaction with his account first so that the network can verify its authenticity.

Once signed, the customer can announce the transaction to the network.

```typescript
const transactionHttp = new TransactionHttp();

// Replace with customer private key
const privateKey: string = 'your-private-key';

const account = Account.createWithPrivateKey(privateKey);

const signedTransaction = account.signTransaction(transferTransaction);

transactionHttp.announceTransaction(signedTransaction).subscribe( x => console.log(x), err=> console.error(err);
```

Execute it running `ts-node transferTransaction.ts`


#### Removing company as the cosigner of the multisig and adding customer

Login with company account. The editing of a contract is straightforward. To do so you need to click on Services in the top panel and when the blockchain network has confirmed the creation of the multi-signature account, Edit an existing contract is enabled for you to click. You can select a contract from Account to edit, and edit the contract accordingly to your needs (adding/removing signers, etc.).

![](/images/editing-multisig.png)

* Remove company account as a cosigner.

* Add customer account as a cosigner.

Make sure "Sigs Needed" field is empty, as we want to keep 1-of-1 multisig.

Enter your password and click send button. Congratulations, you have finished the use case!


### Future work

#### Send the payment and be a cosigner atomically

Probably you have noticed that the customer could pay for the watch, but not being cosigner of the multisig account.

Catapult is the new version of NEM, which provides higher performance and new functionalities to NEM.

In this version, we can create aggregate transactions. Aggregate transactions contain multiple transactions that can be initiated by different accounts. The Aggregate transaction is used when all transactions need to be included in a block or none of them.
                                                       
You can [see here a code example](https://github.com/dgarcia360/workshop-developing-applications-with-NEM/blob/master/code/aggregateTransaction.ts) of how aggregate transactions work using NEM2-SDK, the new software development kit for Catapult.

We encourage you applying to participate in the [early access program for Catapult](https://nem.io/catapult/)
                                                  
#### Multilevel multisig transactions

Catapult also comes with multilevel multisig accounts. A Multi-Level Multisig Account is a multisig that has a cosigner that is another multisig. MLMA accounts add “AND/OR” logic to multi-signature transactions.
                                                       
Imagine that to pass the quality process, not only the company should send a mosaic to the product, but pass the revision of different actors.


## References

This guide uses fragments of text from the following resources.

[NEM Catapult Documentation](https://nemtech.github.io/index.html)

[RB2 NEM Dev Guide](https://rb2nem.github.io/nem-dev-guide/09-mosaics/)

[How to make your first namespace and mosaic!](https://blog.nem.io/maing-namespaces-and-mosaics/)
