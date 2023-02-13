import ISettings from "@/interfaces/ISettings";

function readSettings() {
    return new Promise<ISettings>((resolve, reject) => {
        resolve((JSON.parse(localStorage.getItem('settings')) as ISettings || {} as ISettings));
    });
}

export { readSettings }