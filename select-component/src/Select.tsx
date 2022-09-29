import { KeyboardEventHandler, useEffect, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
    label: string;
    value: string | number;
}

type SingleSelectProps = {
    multiple?: false;
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
}

type MultipleSelectProps = {
    multiple: true;
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
}

type SelectProps = {
    options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps)

export function Select({ multiple, value, onChange, options}: SelectProps){
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    useEffect(() => {
        if(isOpen) setHighlightedIndex(0);
    }, [isOpen])
    
    return (
        <div 
            className={styles.container}
            tabIndex={0} 
            onBlur={() => setIsOpen(false)} 
            onClick={() => setIsOpen(prev => !prev)}
            onKeyDown={ handleKeyboardNavigation }
            >
            <span className={styles.value}>{ multiple ? value.map(v => (
                <button
                    key={v.value}
                    className={styles['option-badge']}
                    onClick={e => {
                        e.stopPropagation();
                        selectOption(v)
                    }}
                >
                    {v.label}
                    <span className={styles['remove-btn']}>&times;</span>
                </button>
            )) : value?.label}</span>
            <button 
                className={styles["clear-btn"]}
                onClick={e => {
                    e.stopPropagation();
                    clearOptions();
                }}
            >&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show: ''}`}>
                {options.map( (option, index) => (
                    <li
                    key={option.value} 
                    className={`
                        ${styles.option} 
                        ${isOptionSelected(option) ? styles.selected : ''}
                        ${index === highlightedIndex ? styles.highlighted : ''}
                    `}
                    onMouseEnter={() => setHighlightedIndex(index)} 
                    onClick={ e => {
                        e.stopPropagation();
                        selectOption(option);
                    }} 
                    > {option.label} </li>
                ))}
            </ul>
        </div>
    )

    function clearOptions(){
        multiple ? onChange([]) :onChange(undefined);
    }

    function selectOption(option: SelectOption){
        if(multiple){
            // remove option if it is already selected
            if(value.includes(option)){
                onChange(value.filter(o => o !== option));
            }else{
                onChange([...value, option]);
            }
        }else{
            if(value !== option) onChange(option);
            setIsOpen(false);
        }
    }

    function isOptionSelected(option: SelectOption){
        return multiple ? value.includes(option) : value === option;
    }

    function handleKeyboardNavigation(e: KeyboardEvent){
        
        // console.log(e);
        // console.log((e.target as HTMLInputElement).className == styles.container);

        if((e.target as HTMLInputElement).className !== styles.container ) return;

        switch (e.code) {
            case "Space":
            case "Enter":
                setIsOpen(prev => !prev);
                if(isOpen) selectOption(options[highlightedIndex]);
                break;

            case "ArrowUp":
            case "ArrowDown": { // block scope to avoid variable hoisting of newValue
                if(!isOpen){
                  setIsOpen(true);
                  break;  
                } 

                const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                if(newValue >= 0 && newValue < options.length){
                    setHighlightedIndex(newValue);
                }
                break;
            }
            case "Escape":
                setIsOpen(false);
                break;
        
            default:
                break;
        }

    }

}