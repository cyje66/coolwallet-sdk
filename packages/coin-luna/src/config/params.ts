export const COIN_TYPE = '8000014a';

export const TRANSFER = {
    script: '03030201C707000000014ACC07100aA00700CC07100aA00700CC07C01E0a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64CC071012A00700CC07100aBFACD7C021FFC002CC071012BFACD7C061FFC002CC07101aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA1080D01BE0700BE0700BE0700BE0700CC071012A0070029AC9700C9CAAC9700C9BE0700BE0700CC071012A00700CC07100aA00700CC07C0270a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21CAA0C70021CC07C00612040a020801CC071018BFACC700C108BE0700CC071012A00700CC07100aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA9080D01BE0700BE0700CC071010BFACC700B108BE0700BE0700CC07C00C1a0A636f6c756d6275732d35CC071020BFACC700B908DC07C0044C554E41DDACD70061FFC0DAACC7C0A10806D207CC05065052455353425554546F4E',
    signature: '0030450221009834810F91ECBE5A8CAA8DEC50E6B92D8C812C8DACA2D4587C4E3E2AE33F59CB02205266A77E6DAD87D2CBECD6F0F8AAB6F5AE76492A8757EF8B5D5394B0C34BE681'
};

export const DELEGATE = {
    script: '03030201C707000000014ACC07100aA00700CC07100aA00700CC07C0250a232f636f736d6f732e7374616b696e672e763162657461312e4d736744656c6567617465CC071012A00700CC07100aBFACD7C021FFC002CC071012BFACD7C061FFC002CC07101aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA1080D01BE0700BE0700BE0700BE0700CC071012A0070029AC9700C9CAAC9700C9BE0700BE0700CC071012A00700CC07100aA00700CC07C0270a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21CAA0C70021CC07C00612040a020801CC071018BFACC700C108BE0700CC071012A00700CC07100aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA9080D01BE0700BE0700CC071010BFACC700B108BE0700BE0700CC07C00C1a0A636f6c756d6275732d35CC071020BFACC700B908DC07C0044C554E41DC07C00544656C6774DDACD70061FFC0DAACC7C0A10806D207CC05065052455353425554546F4E',
    signature: '000030440220202B429154DD883F01C542C0A9CDF96EDC3B58A29AB55A9C38A89D63A480BBE7022003894D7967A9EA991BF629D6865F548F6FA2349FB891902D002F780D0EDD9396'
};

export const UNDELEGATE = {
    script: '03030201C707000000014ACC07100aA00700CC07100aA00700CC07C0270a252f636f736d6f732e7374616b696e672e763162657461312e4d7367556e64656c6567617465CC071012A00700CC07100aBFACD7C021FFC002CC071012BFACD7C061FFC002CC07101aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA1080D01BE0700BE0700BE0700BE0700CC071012A0070029AC9700C9CAAC9700C9BE0700BE0700CC071012A00700CC07100aA00700CC07C0270a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21CAA0C70021CC07C00612040a020801CC071018BFACC700C108BE0700CC071012A00700CC07100aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA9080D01BE0700BE0700CC071010BFACC700B108BE0700BE0700CC07C00C1a0A636f6c756d6275732d35CC071020BFACC700B908DC07C0044C554E41DC07C005556E44656CDDACD70061FFC0DAACC7C0A10806D207CC05065052455353425554546F4E',
    signature: '003045022100F23EC6B6A3AC9FEE817F8FA8384389DFD1EE79795F2F7D498F9C0CEB04BE46CD022078FBD3FA9F07CC161D9A295AE5AB0A68EBAEC66019C3C78C146D830EE6E9C346'
}

export const WITHDRAW = {
    script: '03030201C707000000014ACC07100aA00700CC07100aA00700CC07C0390a372f636f736d6f732e646973747269627574696f6e2e763162657461312e4d7367576974686472617744656c656761746f72526577617264CC071012A00700CC07100aBFACD7C021FFC002CC071012BFACD7C061FFC002BE0700BE0700CC071012A0070029AC9700C1CAAC9700C1BE0700BE0700CC071012A00700CC07100aA00700CC07C0270a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21CAA0C70021CC07C00612040a020801CC071018BFACC700B908BE0700CC071012A00700CC07100aA00700CC07C0070a05756c756e61CC071012A00700BAACC76CA1080D01BE0700BE0700CC071010BFACC700A908BE0700BE0700CC07C00C1a0A636f6c756d6275732d35CC071020BFACC700B108DC07C0044C554E41DC07C006526577617264DDACD70061FFC0D207CC05065052455353425554546F4E',
    signature: '003045022100D030134AC32A92779D7CD88144175CAECE74CC898EA3348CA10D58EBA3F3414B02204FF11662B86DF15F64F1FBAABD52249B0F702AF09FE17B0B6EDCCCF47628877A'
}

export enum TX_TYPE_URL{
    SEND = '/cosmos.bank.v1beta1.MsgSend',
    DELEGATE = '/cosmos.staking.v1beta1.MsgDelegate',
	UNDELEGATE = '/cosmos.staking.v1beta1.MsgUndelegate',
	WITHDRAW = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
}