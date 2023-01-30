declare module '*.css';
declare module '*.svg';
declare module '*.jpg';


declare interface DatasetPartial {
    name: string;
    id: string;
    itemCount: number;
    description: string;
}

declare interface Dataset extends DatasetPartial {
    dateCreated: Date;
    plan: string;
    monthlyCost: MonthlyCost;
    size: number;
    uploadedImages: Image[];
    datasetImages: Image[];
}

declare interface Image {
    url: string;
    name: string;
    displayName?: string;
}

declare interface User {
    name: string;
    email: string;
    profileImage: string;
}

declare interface Cost {
    amount: number;
    name: string;
}

declare interface MonthlyCost {
    storage: number;
    creation: number;
    total: number;
    costs?: Cost[];
}

declare interface Account {
    monthlyCosts: MonthlyCost;
    payments: Cost[];
}