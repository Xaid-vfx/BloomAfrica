declare module 'ua-parser-js' {
    export default class UAParser {
        constructor();
        getResult(): {
            ua: string;
            browser: {
                name?: string;
                version?: string;
            };
            engine: {
                name?: string;
                version?: string;
            };
            os: {
                name?: string;
                version?: string;
            };
            device: {
                model?: string;
                type?: string;
                vendor?: string;
            };
            cpu: {
                architecture?: string;
            };
        };
    }
} 