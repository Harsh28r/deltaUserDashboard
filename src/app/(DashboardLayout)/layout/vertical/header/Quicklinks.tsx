"use client";
import Link from "next/link";
import React from "react";
import * as QuicklinksData from "./Data";

const Quicklinks = () => {
  return (
    <div className="lg:p-5 p-5 lg:border-s border-border dark:border-darkborder">
      <h5 className="text-xl font-semibold mb-4 text-ld">
        Quick Links
      </h5>
      <ul>
        {QuicklinksData.pageLinks.map((links, index) => (
          <li className="mb-4" key={index}>
            <Link
              href={links.href}
              className="text-sm font-semibold text-link dark:text-darklink hover:text-primary dark:hover:text-primary"
            >
              {links.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quicklinks;
