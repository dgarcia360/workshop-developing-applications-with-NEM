import {
    NEMLibrary, NetworkTypes, Address, TransferTransaction, TimeWindow,
    EmptyMessage, Account, TransactionHttp, XEM
} from "nem-library";

// Initialize NEMLibrary for TEST_NET Network
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

// Replace address with company's address
const transferTransaction = TransferTransaction.create(
    TimeWindow.createWithDeadline(),
    new Address("TCFFOM-Q2SBX7-7E2FZC-3VX43Z-TRV4ZN-TXTCGW-BM5J"),
    new XEM(5),
    EmptyMessage
);

const transactionHttp = new TransactionHttp();

// Replace with customer private key
const privateKey: string = 'your-private-key';

const account = Account.createWithPrivateKey(privateKey);

const signedTransaction = account.signTransaction(transferTransaction);

transactionHttp.announceTransaction(signedTransaction).subscribe( x => console.log(x),
    err=> console.error(err));