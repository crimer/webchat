import React, { createContext, useRef, useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    modal: {
        width: '400px',
        padding: '0',
        border: '1px solid gray',
        borderRadius: '20px',
        minWidth: '20vw',
        boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2),
            0px 24px 38px 3px rgba(0, 0, 0, 0.14),
            0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
        '&::backdrop': {
            background: 'rgba(0, 0, 0, 0.6)',
        },
    },
    modalHeader: {
        padding: '16px 24px',
        display: 'flex',
        flexFlow: 'column nowrap',
    },
    modalHeaderText: {
        justifySelf: 'left',
        fontWeight: 500,
        lineHeight: '1.6',
        fontSize: '1.25em',
    },

    modalHeaderCloseButton: {
        '&:hover': {
            backgroundColor: 'lightgray',
            borderTopRightRadius: '8px',
        },
    },
    modalBody: {
        padding: '0px 28px 8px 28px',
    },
    modalFooter: {
        padding: '8px 28px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    modalCloseButton: {
        gridColumn: '3',
        fontWeight: 600,
    },
    modalSendButton: {
        gridColumn: '2',
        fontWeight: 600,
    },
}))

interface IModalContext {
    openModal: (title: string, description: string) => void
    closeModal: () => void
}

export const ModalContext = createContext<IModalContext>({
    openModal: (title: string, description: string) => {
        throw new Error('Контекст модальных окон не проинициализирован')
    },
    closeModal: () => {
        throw new Error('Контекст модальных окон не проинициализирован')
    },
})

export const ModalContextProvider: React.FC = ({ children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const classes = useStyles()
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const openModal = (title: string, description: string) => {
        if (!dialogRef.current) return
        setTitle(title)
        setDescription(description)

        if (title !== '' && description !== '') {
            if (!dialogRef.current.open) dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }

    const closeModal = () => dialogRef.current && dialogRef.current.close()

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            <dialog ref={dialogRef} className={classes.modal}>
                <div className={classes.modalHeader}>
                    <h2>{title}</h2>
                    <span className={classes.modalHeaderText}>
                        {description}
                    </span>
                </div>
                <div className={classes.modalFooter}>
                    <Button
                        onClick={closeModal}
                        className={classes.modalCloseButton}
                        color='primary'>
                        Закрыть
                    </Button>
                </div>
            </dialog>
            {children}
        </ModalContext.Provider>
    )
}
