'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '../badge';

export function MultiSelect<Option>({
    options,
    getValue,
    getLabel,
    selectedValues,
    onSelectedValuesChange,
    selectPlaceholder,
    searchPlaceholder,
    noSearchResultsMessage = 'No results',
}: {
    options: Option[];
    getValue: (option: Option) => string;
    getLabel: (option: Option) => React.ReactNode;
    selectedValues: string[];
    onSelectedValuesChange: (values: string[]) => void;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    noSearchResultsMessage?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredOptions = options.filter((option) => {
        const label = getLabel(option);
        const text = typeof label === 'string' ? label : '';
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between h-auto py-1.5 px-2 min-h-9 hover:bg-background w-full cursor-pointer"
                >
                    <div className="flex gap-1 flex-wrap">
                        {selectedValues.length > 0 ? (
                            selectedValues.map((value) => {
                                const option = options.find((o) => getValue(o) === value);
                                if (option == null) return null;

                                return (
                                    <Badge
                                        key={getValue(option)}
                                        variant="outline"
                                        className="flex items-center gap-1 cursor-pointer group"
                                        onClick={(e) => {
                                            e.stopPropagation(); // tránh mở popover
                                            onSelectedValuesChange(
                                                selectedValues.filter((v) => v !== value),
                                            );
                                        }}
                                    >
                                        {getLabel(option)}
                                        <XIcon className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition" />
                                    </Badge>
                                );
                            })
                        ) : (
                            <span className="text-muted-foreground">{selectPlaceholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        <CommandEmpty>{noSearchResultsMessage}</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    className="cursor-pointer"
                                    key={getValue(option)}
                                    // value={getValue(option)}
                                    value={getLabel(option)?.toString()}
                                    onSelect={(currentValue) => {
                                        // tìm lại option dựa vào label (currentValue)
                                        const selectedOption = options.find(
                                            (o) => getLabel(o)?.toString() === currentValue,
                                        );

                                        if (!selectedOption) return;

                                        const id = getValue(selectedOption); // lấy ID thực sự

                                        if (selectedValues.includes(id)) {
                                            onSelectedValuesChange(
                                                selectedValues.filter((value) => value !== id),
                                            );
                                        } else {
                                            onSelectedValuesChange([...selectedValues, id]);
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedValues.includes(getValue(option))
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {getLabel(option)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
