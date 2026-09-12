import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LanguageService, type SupportedLanguage } from './language.service';

interface SeoContent {
  title: string;
  description: string;
}

const SITE_URL = 'https://olustack.com.br';
const SEO_BY_ROUTE: Record<string, Record<SupportedLanguage, SeoContent>> = {
  '/': {
    PT_BR: {
      title: 'OluStack | Consultoria e Desenvolvimento',
      description: 'Consultoria e desenvolvimento de software sob medida.',
    },
    EN_US: {
      title: 'OluStack | Software Consulting and Development',
      description: 'Custom software consulting and development.',
    },
  },
  '/projects': {
    PT_BR: { title: 'Projetos | OluStack', description: 'Projetos e soluções desenvolvidos pela OluStack.' },
    EN_US: { title: 'Projects | OluStack', description: 'Projects and solutions developed by OluStack.' },
  },
  '/services': {
    PT_BR: { title: 'Serviços | OluStack', description: 'Serviços de desenvolvimento e consultoria em software.' },
    EN_US: { title: 'Services | OluStack', description: 'Software development and consulting services.' },
  },
  '/about': {
    PT_BR: { title: 'Sobre | OluStack', description: 'Conheça a OluStack e sua experiência em engenharia de software.' },
    EN_US: { title: 'About | OluStack', description: 'Learn about OluStack and its software engineering experience.' },
  },
  '/contact': {
    PT_BR: { title: 'Contato | OluStack', description: 'Entre em contato com a OluStack.' },
    EN_US: { title: 'Contact | OluStack', description: 'Get in touch with OluStack.' },
  },
  '/timeline': {
    PT_BR: { title: 'Experiência | OluStack', description: 'Experiência profissional e trajetória em engenharia de software.' },
    EN_US: { title: 'Experience | OluStack', description: 'Professional experience and software engineering journey.' },
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.update(event.urlAfterRedirects));
    effect(() => this.update(this.router.url));
  }

  private update(url: string): void {
    const path = `/${url.split('?')[0].split('#')[0].split('/').filter(Boolean).join('/')}`;
    const content = SEO_BY_ROUTE[path || '/']?.[this.language.currentLang()] ?? SEO_BY_ROUTE['/'].PT_BR;
    const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;

    this.title.setTitle(content.title);
    this.meta.updateTag({ name: 'description', content: content.description });
    this.meta.updateTag({ property: 'og:title', content: content.title });
    this.meta.updateTag({ property: 'og:description', content: content.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: content.title });
    this.meta.updateTag({ name: 'twitter:description', content: content.description });
    this.setLink('canonical', canonicalUrl);
    const routeUrl = `${SITE_URL}${path === '/' ? '' : path}`;
    this.setLink('alternate', `${routeUrl}?lang=PT_BR`, 'pt-BR');
    this.setLink('alternate', `${routeUrl}?lang=EN_US`, 'en-US');
    this.setStructuredData(content, canonicalUrl);
    this.document.documentElement.lang = this.language.currentLang() === 'PT_BR' ? 'pt-BR' : 'en-US';
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ':not([hreflang])'}`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setStructuredData(content: SeoContent, url: string): void {
    const id = 'olustack-structured-data';
    let script = this.document.head.querySelector<HTMLScriptElement>(`script#${id}`);
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: content.title,
      description: content.description,
      url,
    });
  }
}
