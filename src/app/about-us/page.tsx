"use client";
import Title from "@/components/Title";
import NewsletterBox from "@/components/NewsletterBox";
import { assets } from "@/assets/assets";

export default function AboutUs() {
  return (
    <div>
      <div className="text-xl text-center pt-8 border-t">
        <Title text="Hakkımızda" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src={assets.def_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde perspiciatis possimus repellat iusto, consectetur nihil sed ullam.
          </p>
          <b className="text-gray-800">Misyonumuz</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, aliquam quisquam asperiores esse officiis.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text="Neden Bizi Seçmelisiniz" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        {[
          { title: "Kalite Güvencesi" },
          { title: "Yüksek Müşteri Memnuniyeti" },
          { title: "Profesyonel Müşteri Hizmetleri" },
        ].map((item, i) => (
          <div
            key={i}
            className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"
          >
            <b>{item.title}:</b>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        ))}
      </div>
      <NewsletterBox />
    </div>
  );
}
