"use client";
import Link from "next/link";
import React from "react";
import Google from "/public/images/svgs/google-icon.svg";
import FB from "/public/images/svgs/facebook-icon.svg";
import Image from "next/image";
import { HR } from "flowbite-react";

interface MyAppProps {
    title?:string;
  }

const SocialButtons: React.FC<MyAppProps> = ({ title }) => {
  return (
    <>
      <div className="flex justify-between gap-8 my-6 ">
        <Link
          href={"/"}
          className="px-4 py-2.5 border border-ld flex gap-2 items-enter w-full rounded-md text-center justify-center text-ld text-primary-ld"
        >
          <Image src={Google} alt="google" height={18} width={18} /> Google
        </Link>
        <Link
          href={"/"}
          className="px-4 py-2.5 border border-ld flex gap-2 items-enter w-full rounded-md text-center justify-center text-ld text-primary-ld"
        >
          <Image src={FB} alt="google" height={18} width={18} />
          Facebook
        </Link>
      </div>
      {/* Divider */}
      <HR.Text text={`${title}`} className="!border-t !border-ld !bg-transparent" />
    </>
  );
};

export default SocialButtons;
