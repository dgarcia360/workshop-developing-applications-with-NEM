import {
    Account, Deadline, UInt64, TransferTransaction, Mosaic, MosaicId, TransactionHttp, PublicAccount,
    MultisigCosignatoryModification, ModifyMultisigAccountTransaction, MultisigCosignatoryModificationType,
    XEM, AggregateTransaction, LockFundsTransaction, Listener, NetworkType, EmptyMessage
} from 'nem2-sdk';

const apiUrl = "";


// 1- Setup accounts

const watchPublicAccount = PublicAccount.createFromPublicKey("", NetworkType.MIJIN_TEST);
const companyPublicAccount = PublicAccount.createFromPublicKey("", NetworkType.MIJIN_TEST);
const customerAccount = Account.createFromPrivateKey("", NetworkType.MIJIN_TEST);


// 2 - Remove company and add customer Transaction

const removeCompanyModification = new MultisigCosignatoryModification(
    MultisigCosignatoryModificationType.Remove,
    companyPublicAccount
);

const addCustomerModification = new MultisigCosignatoryModification(
    MultisigCosignatoryModificationType.Add,
    customerAccount.publicAccount
);

const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    0,
    0,
    [
        removeCompanyModification,
        addCustomerModification
    ],
    NetworkType.MIJIN_TEST
);

// 3 - Pay company transaction

const paymentTransaction = TransferTransaction.create(
    Deadline.create(),
    companyPublicAccount.address,
    [new Mosaic(new MosaicId("currency:euros"), UInt64.fromUint(100))],
    EmptyMessage,
    NetworkType.MIJIN_TEST
);

// 4 - Atomic Transaction
const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [
        paymentTransaction.toAggregate(customerAccount.publicAccount),
        modifyMultisigAccountTransaction.toAggregate(watchPublicAccount)],
    NetworkType.MIJIN_TEST
);

const signedTransaction = customerAccount.sign(aggregateTransaction);

// 5 - Prevent network spamming
const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    XEM.createRelative(10),
    UInt64.fromUint(1000),
    signedTransaction, NetworkType.MIJIN_TEST);

const signedLockFunds = customerAccount.sign(lockFundsTransaction);

const transactionHttp = new TransactionHttp(apiUrl);
const listener = new Listener(apiUrl);

// 5 - Wait until lock funds transaction confirmed and announce transaction
listener.open().then(() => {
    transactionHttp.announce(signedLockFunds).subscribe(
        transaction => console.log(transaction),
        err => console.error(err)
    );


    listener.confirmed(customerAccount.address)
        .filter(transaction => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedLockFunds.hash)
        .flatMap(transaction => transactionHttp.announceAggregateBonded(signedTransaction))
        .subscribe(
            transaction => console.log(transaction),
            err => console.error(err)
        );
});