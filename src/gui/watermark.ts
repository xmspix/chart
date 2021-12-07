export interface WatermarkOptions {
    text: string;
    color: string;
    fontSize: string;
    fontFamily: string;
}

export default function watermark(view: any, watermark: WatermarkOptions) {
    if (watermark) {
        const w = watermark;
        view.ctx.font = `${w.fontSize} ${w.fontFamily}`;
        view.ctx.fillStyle = w.color;
        view.ctx.textAlign = "center";
        view.ctx.fillText(w.text, view.width, view.height);
    }
}