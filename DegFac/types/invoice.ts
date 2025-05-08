export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Supplier {
    name: string;
    address?: string;
    taxId?: string;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    invoiceDate: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    supplier: Supplier;
    items: InvoiceItem[];
    createdAt: string;
    updatedAt?: string;
}