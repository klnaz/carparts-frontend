"use client";
import Title from "@components/Title";
import NewsletterBox from "@components/NewsletterBox";
import { assets } from "@/assets/assets";
import Image from "next/image"; // <-- burada import

export default function ContactUs() {
  return (
    <div>
      <div className="text-xl text-center pt-8 border-t">
        <Title text="Bize Ulaşın" />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <div className="w-full md:max-w-[480px] relative h-[300px] md:h-[480px]">
          <Image
            src={assets.def_img}
            alt="Mağaza Görseli"
            fill
            style={{ objectFit: "cover" }}
            priority={true} // sayfa yüklenince öncelikli yükle
          />
        </div>

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Mağazamız</p>
          <p className="text-gray-500">
            123 ABC XYZ <br /> 123, ABC, XYZ
          </p>
          <p className="text-gray-500">
            Telefon: 0000 000 00 00 <br /> Email: destek@eticaret.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Kariyer</p>
          <p className="text-gray-500">
            İş ilanlarımız ve daha fazlası için bilgi edinebilirsiniz.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Bizi Keşfedin
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
}
