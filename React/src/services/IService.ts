export default abstract class AbstractService<T> {
    apiUrl!: string;

    postMethod = async (object: T): T => {
        const result = await fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(object),
        }).then((response) => response.json());
        return result;
    };

    setApiUrl(apiUrl: string): void {
        this.apiUrl = apiUrl;
    }
}
