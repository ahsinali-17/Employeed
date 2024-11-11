import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import Faq from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <>
      <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
        <section className="text-center">
          <h1 className="flex flex-col items-center justify-center gradient-title text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter py-4">
            Find your Dream Job
            <span className="flex gap-2 lg:gap-6 items-center">
              and get
              <span className="logo">Employeed</span>
          <span className="text-4xl md:text-4xl text-pretty">.</span>
            </span>
          </h1>
          <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
            Explore thousands of job listing or find the perfect candidate.
          </p>
        </section>
        <div className="flex justify-center gap-6">
          {/* buttons */}
          <Link to="/jobs">
            <Button variant="primary" size="xl">
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="destructive" size="xl">
              Post a Job
            </Button>
          </Link>
        </div>
        {/* corousal */}
        <Carousel
          className="w-[90%] py-10 mx-auto"
          plugins={[Autoplay({ delay: 1000 })]}
          opts={{ loop: true }}
        >
          <CarouselContent className="-ml-2 sm:-ml-4 flex items-center gap-5 sm:gap-20">
            {companies.map((company) => {
              return (
                <CarouselItem
                  key={company.id}
                  className="basis-1/3 lg:basis-1/6 pl-2 sm:pl-4"
                >
                  <img
                    src={company.url}
                    alt={company.name}
                    className="h-9 sm:h-14 object-contain"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        {/* banner */}
        <img src="/banner.jpeg" alt="banner" className="w-full" />
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
          {/* cards */}
          <Card>
            <CardHeader>
              <CardTitle>For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Search and apply for jobs, track applications and more.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>for Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Post jobs, manage applications and find the best candidates.
              </p>
            </CardContent>
          </Card>
        </section>
        {/* accordion */}
        <Accordion type="" collapsible className="w-[75%] mx-auto">
          {Faq.map((faq, index) => {
            return (
              <AccordionItem key={index+1} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </main>
    </>
  );
};

export default LandingPage;
