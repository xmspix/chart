export interface Event{
    events: any[];
    element: any;
    cursorData: any;
}

export class Event {
    // constructor(element: HTMLElement, cursorData: any) {
    constructor(element: HTMLElement) {
        this.events = [];
        this.element = element;
        // this.cursorData = cursorData;
    }

    initEventListeners() {
        // const events = [
        //     {event: 'click', cb: (e:any) => console.log(this.cursorData)},
        // ];

        // this.events = events;

        // console.log(this.events);
        // console.log(this.element);
        

        // events.map((e:any) => this.triggerEvent(e.event, e.cb));
        
        return this;
    }

    addEventListener(event: string, callback: Function) {
        this.events.push({event, callback});
    }

    triggerEvent(eventName: string, cb: Function) {
        this.element.addEventListener(eventName, cb);
        // console.log(this,eventName, cb);
        
        // return this;
    }
}