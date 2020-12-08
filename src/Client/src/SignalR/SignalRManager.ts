import * as SignalR from '@microsoft/signalr'

class SignalRManager {
    public static instance: SignalRManager = new SignalRManager()

    public connection: SignalR.HubConnection

    constructor() {
        this.connection = new SignalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/lothub', {
                transport: SignalR.HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build()
    }

    public start(): Promise<void> {
        if (this.connection.state === SignalR.HubConnectionState.Disconnected)
            return this.connection.start()

        return Promise.resolve()
    }

    public stop(): Promise<void> {
        if (this.connection.state === SignalR.HubConnectionState.Connected)
            this.connection.stop()
        return Promise.resolve()
    }

    public async reconnect(): Promise<void> {
        await this.stop()
        await this.start()
        return Promise.resolve()
    }
    public sendMessage<T>(messageName: string, reciveMessage: T): Promise<void> {
        return this.connection.send(messageName, reciveMessage)
    }
}

export default SignalRManager
