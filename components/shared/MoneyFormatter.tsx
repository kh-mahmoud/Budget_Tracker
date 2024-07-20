import { Currencies } from '@prisma/client';
import React from 'react';


const MoneyFormatter = ({ amount, currency = 'USD' }: { amount: number, currency: Currencies }) => {
    // Create the formatter instance
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    });

    return (
        <span>{formatter.format(amount)}</span>
    );
}

export default MoneyFormatter;
