import React, { createContext, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toast: {
            zIndex: 100000,
            minWidth: 600,
        },
    })
)

type ToastOptions = {
    body: string
    vertical?: 'bottom' | 'top'
    horizontal?: 'left' | 'right' | 'center'
    type: 'success' | 'info' | 'error' | 'warning'
}

interface IToastContext {
    openToast: (options: ToastOptions) => void
}

export const ToastContext = createContext<IToastContext>({
    openToast: (options: ToastOptions) => {
        throw new Error('Контекст тоастов не проинициализирован')
    },
})

export const ToastContextProvider: React.FC = ({ children }) => {
    const styles = useStyles()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [options, setOptions] = useState<ToastOptions>({
        body: '',
        horizontal: 'center',
        vertical: 'top',
        type: 'success'
    })

    const closeToast = () => setIsOpen(false)
    const openToast = (options: ToastOptions) => {
        setIsOpen(true)
        setOptions({
            ...options,
            body: options.body,
            horizontal: options.horizontal,
            vertical: options.vertical,
            type: options.type,
        })
    }

    return (
        <ToastContext.Provider value={{ openToast }}>
            <Snackbar
                className={styles.toast}
                open={isOpen}
                autoHideDuration={6000}
                onClose={closeToast}
                anchorOrigin={{
                    horizontal: options.horizontal || 'center',
                    vertical: options.vertical || 'top',
                }}
                key={options.body}>
                <Alert onClose={closeToast} severity={options.type || 'success'}>
                    {options.body}
                </Alert>
            </Snackbar>

            {children}
        </ToastContext.Provider>
    )
}
