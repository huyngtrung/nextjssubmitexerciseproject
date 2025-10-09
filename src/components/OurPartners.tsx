'use client';

import Image from 'next/image';

const SVG_FILES = ['client1-logo', 'client2-logo', 'client3-logo', 'client4-logo'];

export default function OurPartners() {
    return (
        <div className="relative flex items-center flex-col px-20 pt-20 overflow-hidden bg-white min-h-[80vh]">
            <div className="relative z-10 text-center">
                <div className="mb-16 flex flex-col items-center">
                    <h1 className="card-fade-seq text-5xl font-bold mb-4 text-center">
                        Our Partners
                    </h1>

                    <div className="flex items-center justify-center card-fade-seq">
                        <div className="h-[2px] bg-[#9BBD33] w-10 md:w-20"></div>
                        <div className="h-[6px] bg-[#9BBD33] w-20 md:w-40 rounded"></div>
                        <div className="h-[2px] bg-[#9BBD33] w-10 md:w-20"></div>
                    </div>

                    <p className="text-gray-400 my-12 w-[100vh]">
                        Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                        viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                        Etiam ultricies nisi vel augue.
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-16 items-center justify-items-center">
                    {SVG_FILES.map((file) => (
                        <div key={file} className="w-[30vh] h-full cursor-pointer">
                            <Image
                                src={`/ourPartnersimgs/${file}.png`}
                                alt={file}
                                width={128}
                                height={128}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
