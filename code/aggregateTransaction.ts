import {
    Account, Address, Deadline, UInt64, NetworkType, PlainMessage, TransferTransaction, Mosaic, MosaicId,
    TransactionHttp, PublicAccount, MultisigCosignatoryModification, ModifyMultisigAccountTransaction,
    MultisigCosignatoryModificationType, AccountHttp, XEM, AggregateTransaction, LockFundsTransaction, Listener
} from 'nem2-sdk';

const apiUrl = "";

const aliceAccountPublicKey = "";
const vendorAccountPrivateKey = "";

const alicePublicAccount = PublicAccount.createFromPublicKey(aliceAccountPublicKey, NetworkType.MIJIN_TEST);
const vendorAccount = Account.createFromPrivateKey(vendorAccountPrivateKey, NetworkType.MIJIN_TEST);

const ticketTransaction = TransferTransaction.create(
    Deadline.create(),
    alicePublicAccount.address,
    [new Mosaic(new MosaicId("vendor:ticket"), UInt64.fromUint(1))],
    PlainMessage.create("Sending ticket to Alice"),
    NetworkType.MIJIN_TEST
);

const paymentTransaction = TransferTransaction.create(
    Deadline.create(),
    vendorAccount.address,
    [XEM.createRelative(1)],
    PlainMessage.create("Sending XEM to vendor"),
    NetworkType.MIJIN_TEST
);

const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [ticketTransaction.toAggregate(vendorAccount.publicAccount), paymentTransaction.toAggregate(alicePublicAccount)],
    NetworkType.MIJIN_TEST
);

const signedTransaction = vendorAccount.sign(aggregateTransaction);

const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(), XEM.createRelative(10), UInt64.fromUint(1000), signedTransaction, NetworkType.MIJIN_TEST);
const signedLockFunds = vendorAccount.sign(lockFundsTransaction);

const transactionHttp = new TransactionHttp(apiUrl);
const listener = new Listener(apiUrl);
listener.open().then(() => {
    transactionHttp.announce(signedLockFunds).subscribe(
        transaction => console.log(transaction),
        err => console.error(err)
    );

    listener.confirmed(vendorAccount.address)
        .filter(transaction => transaction.transactionInfo.hash === signedLockFunds.hash)
        .flatMap(transaction => transactionHttp.announceAggregateBonded(signedTransaction))
        .subscribe(
            transaction => console.log(transaction),
            err => console.error(err)
        );
});