import { FC, FormEvent } from 'react'
import { Input } from './Input'
import { Button } from './Button'

interface SearchInputProps {
    search: string
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void
    enableButton?: boolean
}

export const SearchInput: FC<SearchInputProps> = ({
    search,
    onSearchChange,
    onSearchSubmit,
    enableButton = true
}) => {
    return (
        <form onSubmit={onSearchSubmit} className="flex items-center w-full gap-2">
            <Input
                label=""
                value={search}
                onChange={onSearchChange}
                placeholder="Buscar..."
            />
            {enableButton && (
                <Button
                    type="submit"
                >
                    Pesquisar
                </Button>
            )}
        </form>
    )
}
