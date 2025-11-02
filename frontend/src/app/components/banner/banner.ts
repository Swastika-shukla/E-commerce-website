import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class Banner implements AfterViewInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  banners = [
  {
    imageUrl: 'assets/banner-new.png',
    alt: 'Banner 1',
    title: 'Welcome to Our Store',
    description: 'Discover amazing deals and new arrivals.',
    cta: 'Shop Now'
  },
  {
    imageUrl: 'assets/banner5.jpg',
    alt: 'Banner 2',
    title: 'Summer Collection',
    description: 'Fresh styles for sunny days.',
    cta: 'Explore'
  },
  {
    imageUrl: 'assets/banner3.jpg',
    alt: 'Banner 3',
    title: 'Limited Time Offer',
    description: 'Get 30% off on selected items.',
    cta: 'Grab Deal'
  }
];

  currentIndex = 0;
  intervalId: any;

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  startAutoScroll() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      const scrollAmount = this.carousel.nativeElement.offsetWidth * this.currentIndex;
      this.carousel.nativeElement.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }, 5000); 
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}