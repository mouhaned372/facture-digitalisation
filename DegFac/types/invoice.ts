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
    email?: string;
    phone?: string;
}

export interface Invoice {
    _id: string;
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    supplier: Supplier;
    items: InvoiceItem[];
    subtotal?: number;
    taxAmount?: number;
    totalAmount: number;
    paymentStatus?: string;
    createdAt: string;
    updatedAt: string;
}