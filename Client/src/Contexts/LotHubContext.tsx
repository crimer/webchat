import React, { useEffect, useState, useMemo } from 'react'
import SignalRManager from '../SignalR/SignalRManager'

type Bet = {
    authorName: string,
    date: Date,
    value: number
}

interface ILotHubContext {
    doBet: () => void,
    currentLotStatus: LotStatus,
    bets: Bet[]
}

export enum LotStatus {
    Active,
    Completed
}

export const LotHubContext = React.createContext<ILotHubContext>({
    doBet: () => {
        throw new Error('Не проинициализирован контекст лота')
    },
    currentLotStatus: LotStatus.Active,
    bets: []
})

export const LotHubContextProvider: React.FC = ({ children }) => {
    const [bets, setCurrentBets] = useState<Bet[]>([])
    const [currentLotStatus, setCurrentLotStatus] = useState(LotStatus.Active)

    useEffect(() => {
        SignalRManager.instance.connection.on('NotifyAboutNewBet', (bet: Bet) => {
            setCurrentBets(existedBets => [bet, ...existedBets])
        })

        SignalRManager.instance.connection.on('TradesOver', () => {
            setCurrentLotStatus(LotStatus.Completed)
        })

        SignalRManager.instance.start()
    }, [])

    const doBet = () => {
        SignalRManager.instance.connection.send('DoBet')
    }

    return (
        <LotHubContext.Provider value={{ currentLotStatus, doBet, bets }}>
            {children}
        </LotHubContext.Provider>
    )
}