class AccountRepository {
    public login(name: string): Promise<Response> {
        return fetch('https://localhost:5001/account/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
    }

    public logout(): Promise<Response> {
        return fetch('https://localhost:5001/account/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

const accountRepository = new AccountRepository();

export default accountRepository;
