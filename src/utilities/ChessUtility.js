export class Chess {
    static fenParser(FEN) {
        // creating FEN object
        let fen = Chess.getInitialChessState();

        //capturing FEN string details
        let FENStringArray = FEN.split(" ");
        let FENStringRanksArray = FENStringArray[0].split("/");

        //setting fen object ranks
        FENStringRanksArray.forEach((fenRank, index) => {
            let offset = 0;
            let i = 0;
            while (i + offset < 8) {
                for (let j = 0; j < fenRank.length; j++) {
                    if (isNaN(fenRank[j])) {
                        fen.ranks[index][i] = fenRank[j];
                        i++;
                    } else {
                        offset = Number.parseInt(fenRank[j]);
                        i += offset;
                    }
                }
            }
        });

        // setting fen object other remaining properties
        fen.activeColor = FENStringArray[1];
        fen.castlingPrivilege = FENStringArray[2];
        fen.enPassantTarget = FENStringArray[3];
        fen.halfMoveClock = FENStringArray[4];
        fen.fullMoveClock = FENStringArray[5];

        return fen;
    }

    static getInitialChessState() {
        let fen = {
            ranks: new Array(8).fill(null).map((ele) => {
                return new Array(8).fill(1);
            }),
            activeColor: undefined,
            castlingPrivilege: undefined,
            enPassantTarget: undefined,
            halfMoveClock: undefined,
            fullMoveClock: undefined,
        };

        return fen;
    }
}
