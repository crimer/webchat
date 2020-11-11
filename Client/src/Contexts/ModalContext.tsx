import React, { createContext, useRef, useState } from 'react'
import { Button } from '@material-ui/core'

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

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const openModal = (title: string, description: string) => {
        if (!dialogRef.current) return
        setTitle(title)
        setDescription(description)

        if (title !== '' && description !== '') {
            if(!dialogRef.current.open)
                dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }

    const closeModal = () => dialogRef.current && dialogRef.current.close()

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            <dialog ref={dialogRef} className='login-dialog'>
                <div className='login-dialog-header'>
                    <h2 className='login-dialog-header-title'>{title}</h2>
                    <span className='login-dialog-header-text'>
                        {description}
                    </span>
                </div>
                <div className='login-dialog-footer'>
                    <Button
                        onClick={closeModal}
                        className='login-dialog-close-button'
                        color='primary'>
                        Закрыть
                    </Button>
                </div>
            </dialog>
            {children}
        </ModalContext.Provider>
    )
}
