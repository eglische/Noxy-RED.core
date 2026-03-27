export type ServerErrorMessage = {
    $type: 'error';
    message: string;
    code?: string;
    serviceName?: string;
    details?: string;
};
