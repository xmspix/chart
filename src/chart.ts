class Chart {
    data: { name: string; value: number; }[];

    constructor() {
        this.data = [];
    }
    setData(data:any){
        this.data = data;
        return this;
    }
}

export default new Chart();