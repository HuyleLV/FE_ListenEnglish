
export default function Home() {
    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl">Tất cả chương trình học</p>
            <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white">
                <div class="col-span-1 bg-sky-600 rounded-xl">
                    <div className="p-10">
                        <div className="border rounded-full border-slate-200 border-2">
                            <div className="bg-sky-400 w-[40%] rounded-full py-[3px]">
                                <span className="font-bold">40%</span>
                            </div>
                        </div>
                        <p className="pt-[10px] font-semibold text-xl">1: Lear read English</p>
                    </div>
                </div>
                <div class="col-span-1 bg-sky-600 rounded-xl">
                    <div className="p-10">
                        <div className="border rounded-full border-slate-200 border-2">
                            <div className="bg-sky-400 w-[20%] rounded-full py-[3px]">
                                <span className="font-bold">20%</span>
                            </div>
                        </div>
                        <p className="pt-[10px] font-semibold text-xl">2: Lear read English</p>
                    </div>
                </div>
                <div class="col-span-1 bg-sky-600 rounded-xl">
                    <div className="p-10">
                        <div className="border rounded-full border-slate-200 border-2">
                            <div className="bg-sky-400 w-[60%] rounded-full py-[3px]">
                                <span className="font-bold">60%</span>
                            </div>
                        </div>
                        <p className="pt-[10px] font-semibold text-xl">3: Lear read English</p>
                    </div>
                </div>
                <div class="col-span-1 bg-sky-600 rounded-xl">
                    <div className="p-10">
                        <div className="border rounded-full border-slate-200 border-2">
                            <div className="bg-sky-400 w-[10%] rounded-full py-[3px]">
                                <span className="font-bold">10%</span>
                            </div>
                        </div>
                        <p className="pt-[10px] font-semibold text-xl">4: Lear read English</p>
                    </div>
                </div>
            </div>
        </div>
    );
};