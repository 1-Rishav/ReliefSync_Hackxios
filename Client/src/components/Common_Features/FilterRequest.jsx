import { Accordion, AccordionItem, Button, Chip } from '@heroui/react';
import React, { useState } from 'react'

const FilterRequest = ({ open, setOpen, selected, setSelected, }) => {
    const mainOptions = ["Disaster", "Request", "Risk Level"];
    // Sub-options for each accordion
    const subOptions = {
        "Disaster": ["Flood", "Earthquake", "Drought", "Wildfire"],
        "Request": ["Food", "Shelter", "Medical Aids", "Funds"],
        "Risk Level": ["0", "1", "2", "3", "4"],
    };

    const handleSelect = (category, option) => {
        const label = `${category}: ${option}`;

        setSelected((prev) => {
            // Remove any previous selection of the same category
            const filtered = prev.filter((l) => !l.startsWith(`${category}:`));
            // Add the new selection
            return [...filtered, label];
        });
        setOpen(false); // close dropdown if you want
    };

    // Handle removing a selected filter
    const handleClose = (option) => {
        setSelected((prev) => {
            const updated = prev.filter((item) => item !== option);
            return updated; // always return array
        });
    }

    return (
        <>
            <div className='flex items-center justify-end border-b-1 gap-4 h-16 p-2'>
                <div className="flex flex-wrap  gap-2">
                    {selected.map((item, idx) => (
                        <Chip
                            key={idx}
                            size="lg"
                            color="warning"
                            variant="dot"
                            onClose={() => handleClose(item)}
                        >
                            {item}
                        </Chip>
                    ))}
                </div>
                <Button color="success" variant="flat" className="xl:text-2xl font-serif font-medium"
                    onClick={() => setOpen((prev) => !prev)}>Filter</Button>
                {open && (
                    <div className="absolute top-16 right-2 bg-white shadow-lg rounded-lg border w-48 p-2 z-50">
                        <Accordion >
                            {mainOptions.map((option, idx) => (
                                <AccordionItem key={idx} aria-label={option} title={option}>
                                    {subOptions[option].map((sub) => (
                                        <button
                                            key={sub}
                                            className="w-full text-left px-2 py-1 hover:bg-gray-200 rounded-md flex items-center"
                                            onClick={() => handleSelect(option, sub)}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
        </>
    )
}

export default FilterRequest