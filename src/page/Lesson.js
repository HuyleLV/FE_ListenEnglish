import cd from "../component/icon/cd.png"

export default function Lesson() {
    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">Lear read English</p>
            <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white">
                <div class="col-span-1 bg-sky-600 rounded-full">
                    <div className="p-5">
                        <center>
                            <img src={cd} className="h-20 w-20"/>
                        </center>
                        <p className="pt-[10px] font-semibold text-xl">1: Lear read English</p>
                    </div>
                </div>
            </div>
        </div>
    );
};