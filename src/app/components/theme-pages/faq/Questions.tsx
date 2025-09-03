"use client";
import React from "react";
import { Accordion } from "flowbite-react";

const faqPage = [
  {
    question: "What is an Admin Dashboard?",
    answer:
      "Admin Dashboard is the backend interface of a website or an application that helps to manage the website s overall content and settings. It is widely used by the site owners to keep track of their website, make changes to their content, and more.",
  },
  {
    question: "What should an admin dashboard template include?",
    answer:
      "Admin dashboard template should include user & SEO friendly design with a variety of components and application designs to help create your own web application with ease. This could include customization options, technical support and about 6 months of future updates.",
  },
  {
    question: "Why should I buy admin templates from wrappixel?",
    answer:
      "wrappixel offers high-quality templates that are easy to use and fully customizable. With over 101,801 happy customers & trusted by 10,000+ Companies. wrappixel is recognized as the leading online source for buying admin templates.",
  },
  {
    question: "Do wrappixel offers a money back guarantee?",
    answer:
      "There is no money back guarantee in most companies, but if you are unhappy with our product, wrappixel gives you a 100% money back guarantee.",
  },
];

const Questions = () => {
  return (
    <>
      <div className="flex justify-center py-10">
        <div className="max-w-xl ">
          <h2 className="text-2xl text-center mb-3">
            Frequently asked questions
          </h2>
          <p className="text-darklink text-base">
            Get to know more about ready-to-use admin dashboard templates
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto ">
        <Accordion collapseAll className="bg-white dark:bg-dark">
          {faqPage.map((faq, i) => (
            <Accordion.Panel key={i} className="bg-white dark:bg-dark">
              <Accordion.Title>{faq.question}</Accordion.Title>
              <Accordion.Content>{faq.answer}</Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default Questions;
